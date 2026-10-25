import io
import logging
import re
from typing import Optional
from urllib.parse import urljoin

import httpx
import imagehash
from PIL import Image

logger = logging.getLogger(__name__)

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
IMAGE_HEADERS = {
    "User-Agent": BROWSER_UA,
    "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
}
PAGE_HEADERS = {
    "User-Agent": BROWSER_UA,
    "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
}

SKIP_WORDS = (
    "logo", "icon", "avatar", "favicon", "pixel", "badge", "spinner", "sprite",
    "placeholder", "loader", "blank", "1x1", "playstore", "app-store", "qr-code",
)
BAD_EXT = (".svg", ".gif", ".ico")
MAX_PHOTOS = 6
MAX_BYTES = 6_000_000


def is_listing_image(url: str) -> bool:
    low = url.lower()
    if not low.startswith(("http://", "https://")):
        return False
    path = low.split("?", 1)[0]
    if path.endswith(BAD_EXT):
        return False
    return not any(w in low for w in SKIP_WORDS)


def clean_image_urls(urls: list[str], base_url: Optional[str] = None, limit: int = MAX_PHOTOS) -> list[str]:
    """Resolve relative links, strip stray punctuation, drop logos/icons, dedupe."""
    out: list[str] = []
    seen: set[str] = set()
    for raw in urls:
        if not raw:
            continue
        u = str(raw).strip().strip("<>\"'").rstrip(").,;]")
        if u.startswith("//"):
            u = "https:" + u
        elif base_url and not u.lower().startswith(("http://", "https://")):
            u = urljoin(base_url, u)
        u = u.replace("&amp;", "&")
        if not is_listing_image(u) or u in seen:
            continue
        seen.add(u)
        out.append(u)
        if len(out) >= limit:
            break
    return out


_META_A = re.compile(
    r"""<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*?content=["']([^"']+)["']""",
    re.I,
)
_META_B = re.compile(
    r"""<meta[^>]+content=["']([^"']+)["'][^>]*?(?:property|name)=["'](?:og:image|twitter:image)["']""",
    re.I,
)
_IMG_TAG = re.compile(
    r"""<img[^>]+?(?:data-src|data-original|src)=["']([^"']+\.(?:jpe?g|png|webp)(?:\?[^"']*)?)["']""",
    re.I,
)


async def find_page_images(url: str) -> list[str]:
    """Best-effort: fetch the page directly and read og:image / <img> tags.

    Used only when the TinyFish text had no usable photos. Any failure returns [].
    """
    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, headers=PAGE_HEADERS) as client:
            resp = await client.get(url)
        if resp.status_code != 200 or "html" not in resp.headers.get("content-type", "").lower():
            return []
        html = resp.text[:600_000]
    except Exception:
        return []

    found: list[str] = []
    found += _META_A.findall(html)
    found += _META_B.findall(html)
    found += _IMG_TAG.findall(html)
    return clean_image_urls(found, base_url=str(resp.url))


async def download_photo(url: str) -> Optional[bytes]:
    """Download an image with browser-like headers; None on any problem."""
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True, headers=IMAGE_HEADERS) as client:
            resp = await client.get(url)
            if resp.status_code == 200 and 0 < len(resp.content) <= MAX_BYTES:
                return resp.content
    except Exception:
        pass
    return None


def perceptual_hash(data: bytes) -> Optional[str]:
    try:
        img = Image.open(io.BytesIO(data))
        return str(imagehash.phash(img))
    except Exception:
        return None


def hash_distance(a: str, b: str) -> int:
    try:
        return imagehash.hex_to_hash(a) - imagehash.hex_to_hash(b)
    except Exception:
        return 999