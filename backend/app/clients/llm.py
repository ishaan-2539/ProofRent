import asyncio
import json
import logging
import re
from typing import Any, Dict, Optional

import httpx
from app.core.config import get_settings
from app.core.errors import ProofRentError

logger = logging.getLogger(__name__)


def _parse_json(text: str) -> Dict[str, Any]:
    """Parse model output as JSON, tolerating ```json fences and stray prose."""
    text = (text or "").strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE).strip()
    try:
        return json.loads(text)
    except ValueError:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


class LLMClient:
    def __init__(self) -> None:
        settings = get_settings()
        self.provider = settings.llm_provider.lower()
        self.api_key = settings.llm_api_key
        self.model = settings.llm_model

    async def extract_json(
        self, system_prompt: str, user_prompt: str, json_schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Call the configured provider and return parsed JSON. One retry, then a
        ProofRentError that CONTAINS the real reason (so it shows in the UI/log)."""
        if not self.api_key:
            raise ProofRentError(
                code="INTERNAL",
                custom_message="LLM_API_KEY is empty.",
                next_step="Set LLM_API_KEY in .env and restart the backend.",
            )

        last_err = "unknown error"
        for attempt in range(2):
            try:
                if self.provider == "openai":
                    return await self._call_openai(system_prompt, user_prompt)
                if self.provider == "anthropic":
                    return await self._call_anthropic(system_prompt, user_prompt)
                if self.provider == "gemini":
                    return await self._call_gemini(system_prompt, user_prompt)
                raise ProofRentError(
                    code="INTERNAL",
                    custom_message=f"Unsupported LLM_PROVIDER '{self.provider}'.",
                    next_step="Use gemini, openai or anthropic.",
                )
            except ProofRentError:
                raise
            except httpx.HTTPStatusError as e:
                body = e.response.text[:400].replace("\n", " ")
                last_err = f"{self.provider} HTTP {e.response.status_code}: {body}"
            except Exception as e:  # network, bad JSON, unexpected shape
                last_err = f"{type(e).__name__}: {e}"
            logger.error("LLM attempt %s failed: %s", attempt + 1, last_err)
            if attempt == 0:
                await asyncio.sleep(1.5)

        raise ProofRentError(
            code="INTERNAL",
            custom_message=f"LLM extraction failed ({last_err})",
            next_step="Check LLM_PROVIDER, LLM_API_KEY and LLM_MODEL in .env.",
        )

    async def _call_openai(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": self.model or "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.0,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            return _parse_json(resp.json()["choices"][0]["message"]["content"])

    async def _call_anthropic(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        payload = {
            "model": self.model,
            "max_tokens": 4000,
            "system": system_prompt + "\nRespond ONLY with valid JSON.",
            "messages": [{"role": "user", "content": user_prompt}],
            "temperature": 0.0,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
            resp.raise_for_status()
            return _parse_json(resp.json()["content"][0]["text"])

    async def _call_gemini(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        model = self.model or "gemini-2.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        headers = {"Content-Type": "application/json", "x-goog-api-key": self.api_key}
        payload = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.0,
                "maxOutputTokens": 8192,
            },
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            cands = data.get("candidates") or []
            if not cands:
                raise ValueError(f"Gemini returned no candidates: {str(data)[:300]}")
            parts = cands[0].get("content", {}).get("parts") or []
            text = "".join(p.get("text", "") for p in parts)
            return _parse_json(text)


_llm_client: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client
