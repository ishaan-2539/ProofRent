import json
from pathlib import Path
from typing import Any

_CONSTANTS_CACHE: dict[str, Any] | None = None

def get_constants() -> dict[str, Any]:
    global _CONSTANTS_CACHE
    if _CONSTANTS_CACHE is None:
        path = Path(__file__).parents[3] / "shared" / "constants.json"
        with open(path, "r", encoding="utf-8") as f:
            _CONSTANTS_CACHE = json.load(f)
    return _CONSTANTS_CACHE

def get_portal(portal_id: str) -> dict[str, Any] | None:
    constants = get_constants()
    for portal in constants.get("portals", []):
        if portal["id"] == portal_id:
            return portal
    return None

def get_threshold(name: str) -> float:
    constants = get_constants()
    return float(constants.get("thresholds", {}).get(name, 0))