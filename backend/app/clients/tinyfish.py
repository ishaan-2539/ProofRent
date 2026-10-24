import asyncio
from typing import Any, AsyncIterator, Optional, Callable, Awaitable
import httpx

from app.core.config import get_settings
from app.core.errors import ProofRentError, map_tinyfish_error
from app.schemas import CapturedPage, SearchHit, AgentResult, WalletInfo, JobEvent, JobEventType


class TinyFishClient:
    """Client for TinyFish Web-Agent APIs (Search, Fetch, Agent)."""

    def __init__(self):
        self.settings = get_settings()
        self.base_headers = {
            "X-API-Key": self.settings.tinyfish_api_key,
            "Content-Type": "application/json",
        }
        self.semaphore = asyncio.Semaphore(self.settings.agent_concurrency)

    async def _request(
        self, 
        method: str, 
        url: str, 
        json_data: Optional[dict] = None, 
        params: Optional[dict] = None,
        timeout: float = 30.0
    ) -> dict[str, Any]:
        """Base HTTP request wrapper with error handling and retries."""
        async with httpx.AsyncClient(timeout=timeout) as client:
            for attempt in range(3):
                try:
                    resp = await client.request(
                        method, 
                        url, 
                        headers=self.base_headers, 
                        json=json_data, 
                        params=params
                    )
                    if resp.status_code == 200:
                        return resp.json()
                    elif resp.status_code == 429:
                        if attempt < 2:
                            await asyncio.sleep(2.0 * (attempt + 1))
                            continue
                        raise map_tinyfish_error("RATE_LIMIT_EXCEEDED", 429)
                    elif resp.status_code in (402, 403):
                        raise map_tinyfish_error("INSUFFICIENT_CREDITS", resp.status_code)
                    else:
                        raise map_tinyfish_error(f"HTTP_{resp.status_code}", resp.status_code)
                except httpx.RequestError:
                    if attempt < 2:
                        await asyncio.sleep(1.0 * (attempt + 1))
                        continue
                    raise ProofRentError("INTERNAL", "Failed to connect to TinyFish API.")
        raise ProofRentError("INTERNAL", "TinyFish request exceeded retry limit.")

    async def search(self, query: str) -> list[SearchHit]:
        """GET api.search.tinyfish.ai"""
        url = "https://api.search.tinyfish.ai/search"
        data = await self._request("GET", url, params={"q": query})
        
        results = []
        for item in data.get("results", []):
            results.append(
                SearchHit(
                    url=item.get("url", ""),
                    title=item.get("title", ""),
                    snippet=item.get("snippet", "")
                )
            )
        return results

    async def fetch(self, urls: list[str]) -> list[CapturedPage]:
        """POST api.fetch.tinyfish.ai (supports up to 10 URLs per batch)."""
        url = "https://api.fetch.tinyfish.ai/fetch"
        payload = {"urls": urls[:10], "format": "markdown"}
        
        data = await self._request("POST", url, json_data=payload, timeout=45.0)
        
        error_urls = {err.get("url"): err.get("error") for err in data.get("errors", [])}
        
        pages: list[CapturedPage] = []
        for page_data in data.get("pages", []):
            target_url = page_data.get("url", "")
            is_error = target_url in error_urls
            
            pages.append(
                CapturedPage(
                    url=target_url,
                    final_url=page_data.get("final_url", target_url),
                    text=page_data.get("content", ""),
                    html=page_data.get("html"),
                    captured_at=page_data.get("captured_at"),
                    ok=not is_error,
                    fetched_via="fetch",
                    error_code=error_urls.get(target_url) if is_error else None
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
        on_event: Optional[Callable[[dict], Awaitable[None]]] = None
    ) -> AgentResult:
        """POST agent.tinyfish.ai/v1/automation/run-sse"""
        async with self.semaphore:
            endpoint = "https://agent.tinyfish.ai/v1/automation/run-sse"
            payload = {
                "goal": goal,
                "url": url,
                "output_schema": output_schema,
                "stealth": stealth,
                "max_duration_seconds": self.settings.agent_max_duration_seconds
            }

            stream_url = None
            last_output = None
            
            try:
                async with httpx.AsyncClient(timeout=float(self.settings.agent_max_duration_seconds)) as client:
                    async with client.stream("POST", endpoint, headers=self.base_headers, json=payload) as response:
                        if response.status_code != 200:
                            return AgentResult(success=False, status="FAILED", error_code=f"HTTP_{response.status_code}")
                        
                        async for line in response.aiter_lines():
                            if line.startswith("data:"):
                                data_str = line[5:].strip()
                                # Forward stream events to progress listener if registered
                                if on_event and data_str:
                                    import json
                                    try:
                                        evt = json.loads(data_str)
                                        if evt.get("type") == "STREAM_URL":
                                            stream_url = evt.get("stream_url")
                                        if evt.get("type") == "COMPLETE":
                                            last_output = evt.get("output")
                                        await on_event(evt)
                                    except Exception:
                                        pass
            except Exception as e:
                return AgentResult(success=False, status="FAILED", error_code="AGENT_TIMEOUT_OR_ERROR")

            # Check for non-empty output
            has_data = bool(last_output and any(v is not None for v in last_output.values())) if isinstance(last_output, dict) else False
            return AgentResult(
                success=has_data,
                status="COMPLETED" if has_data else "FAILED",
                output=last_output,
                stream_url=stream_url
            )

    async def get_wallet(self) -> WalletInfo:
        """Fetch remaining TinyFish API balance."""
        try:
            data = await self._request("GET", "https://api.tinyfish.ai/v1/wallet")
            return WalletInfo(ok=True, balance_usd=data.get("balance_usd"))
        except Exception:
            return WalletInfo(ok=False)


_client_instance: Optional[TinyFishClient] = None

def get_tinyfish_client() -> TinyFishClient:
    global _client_instance
    if _client_instance is None:
        _client_instance = TinyFishClient()
    return _client_instance