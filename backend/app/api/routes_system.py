from fastapi import APIRouter
from app.core.constants import get_constants
from app.schemas import ExampleListing, PreflightResult

router = APIRouter(prefix="/api", tags=["system"])


@router.get("/health")
async def health_check():
    constants = get_constants()
    return {"ok": True, "contract_version": constants.get("contract_version", "1.0")}


@router.get("/examples", response_model=list[ExampleListing])
async def get_examples():
    """Return cached example listings for rapid replay/demo testing."""
    return [
        ExampleListing(
            example_id="match",
            title="Aggarwal PG, Govindpuri",
            description="Twin sharing AC room listing on Magicbricks",
            url="https://www.magicbricks.com/propertyDetail/aggarwal-paying-guest-pg-govindpuri-in-new-delhi&pgid=4d42333331303339677261646532",
            portal="magicbricks"
        ),
        ExampleListing(
            example_id="no_match",
            title="Sunny PG Kalkaji",
            description="Single room listing with no duplicates across portals",
            url="https://www.magicbricks.com/propertyDetail/sunny-pg-kalkaji",
            portal="magicbricks"
        ),
        ExampleListing(
            example_id="hidden_fees",
            title="Mathur PG Govindpuri",
            description="Listing with unstated electricity and maintenance charges",
            url="https://pgdekho.com/pg-in-govindpuri-delhi",
            portal="pgdekho"
        ),
        ExampleListing(
            example_id="blocked",
            title="99acres Premium Flat",
            description="Listing requiring stealth agent navigation",
            url="https://www.99acres.com/pg-in-delhi",
            portal="ninetynineacres"
        )
    ]