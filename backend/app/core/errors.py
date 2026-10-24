from typing import Optional
from app.core.constants import get_constants

class ProofRentError(Exception):
    def __init__(self, code: str, custom_message: Optional[str] = None, next_step: Optional[str] = None):
        constants = get_constants()
        error_msgs = constants.get("error_messages", {})
        self.code = code
        self.message = custom_message or error_msgs.get(code, "An unexpected error occurred.")
        self.next_step = next_step
        super().__init__(self.message)

def map_tinyfish_error(error_code: str, http_status: int = 500) -> ProofRentError:
    if error_code == "SITE_BLOCKED":
        return ProofRentError("POLICY_BLOCKED", "Portal blocked automated access. We do not bypass protection.", "Try a different portal listing.")
    elif error_code in ("RATE_LIMIT_EXCEEDED", "429"):
        return ProofRentError("RATE_LIMITED", "TinyFish API rate limit reached.", "Please retry in a few moments.")
    elif error_code in ("INSUFFICIENT_CREDITS", "BILLING_REJECTED"):
        return ProofRentError("INTERNAL", "API credits exhausted.", "Switching to replay/cached mode.")
    return ProofRentError("INTERNAL", f"TinyFish error ({error_code}).", "You can retry this request.")