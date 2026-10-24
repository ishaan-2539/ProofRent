import asyncio
import json
from datetime import datetime, timezone
from typing import Any, Awaitable, Callable, Optional

import httpx

from app.core.config import get_settings
from app.core.errors import ProofRentError, map_tinyfish_error
from app.schemas import AgentResult, CapturedPage, SearchHit, WalletInfo

SEARCH_URL = "https://api.search.tinyfish.ai"
FETCH_URL = "https://api.fetch.tinyfish.ai"
AGENT_SSE_URL = "https://agent.tinyfish.ai/v1/automation/run-sse"


class TinyFishClient:
    """Client for TinyFish Search, Fetch and Agent APIs.

    Shapes below follow https://docs.tinyfish.ai :
      Search: GET  ?query=...            -> {"results": [{url,title,snippet,...}]}
      Fetch : POST {"urls": [...], "format": "markdown"}
                                         -> {"results": [{url,final_url,title,text,...}],
                                             "errors":  [{url,error}]}
      Agent : POST run-sse               -> SSE events STARTED, STREAMING_URL, PROGRESS, COMPLETE
    """

    def __init__(self):
        self.semaphore = asyncio.Semaphore(get_settings().agent_concurrency)

    @property
    def base_headers(self) -> dict[str, str]:
        settings = get_settings()
        return {
            "X-API-Key": settings.tinyfish_api_key,
            "Content-Type": "application/json",
        }

    def _require_key(self) -> None:
        if not get_settings().tinyfish_api_key:
            raise ProofRentError(
                code="INTERNAL",
                custom_message="TINYFISH_API_KEY is not set.",
                next_step="Add it to your .env file and restart the backend.",
            )

    async def _request(
        self,
        method: str,
        url: str,
        json_data: Optional[dict] = None,
        params: Optional[dict] = None,
        timeout: float = 30.0,
    ) -> dict[str, Any]:
        """HTTP wrapper: retries, error mapping. The only place requests are made."""
        self._require_key()
        async with httpx.AsyncClient(timeout=timeout) as client:
            for attempt in range(3):
                try:
                    resp = await client.request(
                        method, url, headers=self.base_headers, json=json_data, params=params
                    )
                except httpx.RequestError:
                    if attempt < 2:
                        await asyncio.sleep(1.0 * (attempt + 1))
                        continue
                    raise ProofRentError("INTERNAL", "Failed to connect to TinyFish API.")

                if resp.status_code == 200:
                    return resp.json()
                if resp.status_code == 401:
                    raise ProofRentError(
                        code="INTERNAL",
                        custom_message="TinyFish rejected the API key (401).",
                        next_step="Check TINYFISH_API_KEY in .env.",
                    )
                if resp.status_code == 429:
                    if attempt < 2:
                        await asyncio.sleep(2.0 * (attempt + 1))
                        continue
                    raise map_tinyfish_error("RATE_LIMIT_EXCEEDED", 429)
                if resp.status_code in (402, 403):
                    raise map_tinyfish_error("INSUFFICIENT_CREDITS", resp.status_code)
                if resp.status_code >= 500 and attempt < 2:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                raise map_tinyfish_error(f"HTTP_{resp.status_code}", resp.status_code)
        raise ProofRentError("INTERNAL", "TinyFish request exceeded retry limit.")

    async def search(self, query: str) -> list[SearchHit]:
        data = await self._request("GET", SEARCH_URL, params={"query": query})
        return [
            SearchHit(
                url=item.get("url", ""),
                title=item.get("title", ""),
                snippet=item.get("snippet", ""),
            )
            for item in data.get("results", [])
        ]

    async def fetch(self, urls: list[str]) -> list[CapturedPage]:
        """Up to 10 URLs per call. Per-URL failures come back in errors[] with HTTP 200."""
        data = await self._request(
            "POST",
            FETCH_URL,
            json_data={"urls": urls[:10], "format": "markdown"},
            timeout=60.0,
        )
        now = datetime.now(timezone.utc)
        pages: list[CapturedPage] = []

        for r in data.get("results", []):
            text = r.get("text") or ""
            if not isinstance(text, str):
                text = json.dumps(text)
            pages.append(
                CapturedPage(
                    url=r.get("url", ""),
                    final_url=r.get("final_url") or r.get("url", ""),
                    text=text,
                    captured_at=now,
                    ok=bool(text.strip()),
                    fetched_via="fetch",
                    error_code=None if text.strip() else "EMPTY_CONTENT",
                )
            )

        for e in data.get("errors", []):
            pages.append(
                CapturedPage(
                    url=e.get("url", ""),
                    final_url=e.get("url", ""),
                    text="",
                    captured_at=now,
                    ok=False,
                    fetched_via="fetch",
                    error_code=str(e.get("error") or "FETCH_ERROR"),
                )
            )
        return pages

    async def run_agent(
        self,
        goal: str,
        url: str,
        output_schema: Optional[dict] = None,
        *,
        stealth: bool = False,
        on_event: Optional[Callable[[dict], Awaitable[None]]] = None,
    ) -> AgentResult:
        """POST agent.tinyfish.ai/v1/automation/run-sse (max 2 at once via semaphore)."""
        self._require_key()
        settings = get_settings()

        payload: dict[str, Any] = {
            "goal": goal,
            "url": url,
            "browser_profile": "stealth" if stealth else "lite",
            "max_duration_seconds": settings.agent_max_duration_seconds,
        }
        if stealth:
            # Docs list US/GB/CA/DE/FR/JP/AU; your trial used an India proxy.
            # If the API answers 400, change country_code or remove proxy_config.
            payload["proxy_config"] = {"enabled": True, "type": "tetra", "country_code": "IN"}
        if output_schema:
            payload["output_schema"] = output_schema

        stream_url: Optional[str] = None
        last_output: Optional[dict] = None
        final_status: Optional[str] = None
        steps = 0

        async with self.semaphore:
            try:
                timeout = float(settings.agent_max_duration_seconds) + 30.0
                async with httpx.AsyncClient(timeout=timeout) as client:
                    async with client.stream(
                        "POST", AGENT_SSE_URL, headers=self.base_headers, json=payload
                    ) as response:
                        if response.status_code != 200:
                            return AgentResult(
                                success=False,
                                status="FAILED",
                                error_code=f"HTTP_{response.status_code}",
                            )

                        async for line in response.aiter_lines():
                            if not line.startswith("data:"):
                                continue
                            try:
                                evt = json.loads(line[5:].strip())
                            except ValueError:
                                continue

                            etype = evt.get("type")
                            if etype == "STREAMING_URL":
                                stream_url = evt.get("streaming_url")
                            elif etype == "PROGRESS":
                                steps += 1
                            elif etype == "COMPLETE":
                                final_status = evt.get("status")
                                last_output = evt.get("result") or evt.get("resultJson")

                            if on_event:
                                await on_event(evt)
            except Exception:
                return AgentResult(
                    success=False,
                    status="FAILED",
                    error_code="AGENT_TIMEOUT_OR_ERROR",
                    stream_url=stream_url,
                    steps=steps,
                )

        # COMPLETED does not mean success: empty / all-null output counts as failed.
        has_data = (
            final_status == "COMPLETED"
            and isinstance(last_output, dict)
            and any(v is not None for v in last_output.values())
        )
        return AgentResult(
            success=has_data,
            status="COMPLETED" if has_data else (final_status or "FAILED"),
            output=last_output if isinstance(last_output, dict) else None,
            steps=steps,
            stream_url=stream_url,
            error_code=None if has_data else "EMPTY_OR_FAILED_RESULT",
        )

    async def get_wallet(self) -> WalletInfo:
        """Best-effort balance check. The wallet endpoint is not in the public docs
        I could find, so this only confirms the key works via a cheap Search call."""
        try:
            await self._request("GET", SEARCH_URL, params={"query": "pg in govindpuri delhi"})
            return WalletInfo(ok=True, balance_usd=None)
        except Exception:
            return WalletInfo(ok=False)


_client_instance: Optional[TinyFishClient] = None


def get_tinyfish_client() -> TinyFishClient:
    global _client_instance
    if _client_instance is None:
        _client_instance = TinyFishClient()
    return _client_instance