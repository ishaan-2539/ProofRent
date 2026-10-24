import sys
from pathlib import Path
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.clients.llm import get_llm_client
from app.core.errors import ProofRentError


def test_get_llm_client_instantiation():
    client = get_llm_client()
    assert client is not None
    assert hasattr(client, "provider")