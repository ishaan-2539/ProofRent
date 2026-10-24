import io
from typing import Optional
import httpx
from PIL import Image
import imagehash


async def download_photo(url: str) -> Optional[bytes]:
    """Download photo content from image URL with timeout handling."""
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return resp.content
    except Exception:
        pass
    return None


def perceptual_hash(data: bytes) -> Optional[str]:
    """Compute perceptual image hash (phash) for photo similarity comparison."""
    try:
        img = Image.open(io.BytesIO(data))
        return str(imagehash.phash(img))
    except Exception:
        return None


def hash_distance(a: str, b: str) -> int:
    """Compute Hamming distance between two perceptual hashes."""
    try:
        hash_a = imagehash.hex_to_hash(a)
        hash_b = imagehash.hex_to_hash(b)
        return hash_a - hash_b
    except Exception:
        return 999