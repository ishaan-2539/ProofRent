import json
import logging
from typing import Any, Dict, Optional

import httpx
from app.core.config import get_settings
from app.core.errors import ProofRentError

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self) -> None:
        settings = get_settings()
        self.provider = settings.llm_provider.lower()
        self.api_key = settings.llm_api_key
        self.model = settings.llm_model

    async def extract_json(
        self, system_prompt: str, user_prompt: str, json_schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Sends prompts to the configured LLM provider and parses strict JSON output.
        Retries once on JSON parsing or provider failure before raising ProofRentError.
        """
        for attempt in range(2):
            try:
                if self.provider == "openai":
                    return await self._call_openai(system_prompt, user_prompt, json_schema)
                elif self.provider == "anthropic":
                    return await self._call_anthropic(system_prompt, user_prompt, json_schema)
                elif self.provider == "gemini":
                    return await self._call_gemini(system_prompt, user_prompt, json_schema)
                else:
                    raise ProofRentError(
                        code="INTERNAL",
                        message=f"Unsupported LLM provider: {self.provider}",
                    )
            except Exception as e:
                logger.warning(f"LLM extraction attempt {attempt + 1} failed: {e}")
                if attempt == 1:
                    if isinstance(e, ProofRentError):
                        raise e
                    raise ProofRentError(
                        code="INTERNAL",
                        message="Failed to extract structured data from listing page.",
                        next_step="Try running the investigation again.",
                    ) from e

        raise ProofRentError(code="INTERNAL", message="LLM extraction max retries reached.")

    async def _call_openai(
        self, system_prompt: str, user_prompt: str, json_schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model or "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.0,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)

    async def _call_anthropic(
        self, system_prompt: str, user_prompt: str, json_schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        payload = {
            "model": self.model or "claude-3-5-sonnet-20241022",
            "max_tokens": 4000,
            "system": system_prompt + "\nRespond ONLY with valid JSON matching the requested schema.",
            "messages": [{"role": "user", "content": user_prompt}],
            "temperature": 0.0,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["content"][0]["text"]
            return json.loads(content)

    async def _call_gemini(
        self, system_prompt: str, user_prompt: str, json_schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        model = self.model or "gemini-2.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"parts": [{"text": user_prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.0,
            },
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(content)


_llm_client: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client