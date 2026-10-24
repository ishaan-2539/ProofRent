from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional, Union

from pydantic import BaseModel, Field

# ---------------------------------------------------------------- literals
PortalId = Literal["magicbricks", "pgdekho", "nobroker", "housing", "gopgo", "hexahome", "ninetynineacres"]
EvidenceLabel = Literal["verified", "inferred", "uncertain", "unknown"]
Confidence = Literal["high", "medium", "low"]
SharingType = Literal["single", "double", "triple", "quad", "other"]
ListingStatus = Literal["live", "removed", "unknown"]
SignalFamily = Literal["location", "identity", "content", "visual"]
MatchLevel = Literal["match", "possible"]
MatchScope = Literal["same_place", "same_operator_branch"]
MatchStatus = Literal["match_found", "possible_match", "several_candidates", "no_match", "not_checked"]
PortalCheckStatus = Literal["checked", "blocked", "failed", "skipped", "unsupported"]
UserDecision = Literal["confirmed", "rejected"]
CostKey = Literal["rent", "deposit", "food", "electricity", "ac", "maintenance", "brokerage", "notice_period", "lock_in"]
CostLabel = Literal["listed", "assumed", "unknown"]
Recurrence = Literal["monthly", "one_time", "terms"]
LadderStatus = Literal["ok", "rent_missing", "failed"]
PricePosition = Literal["below", "near", "above"]
FairPriceStatus = Literal["ok", "not_enough_data"]
FindingKind = Literal["same_place", "cost", "fair_price", "listing_status"]
ModuleName = Literal["listing", "matching", "cost", "fair_price", "questions"]
ModuleStatus = Literal["pending", "working", "success", "partial", "empty", "failed", "not_checked"]
JobStatus = Literal["queued", "running", "completed", "partial", "failed"]
JobEventType = Literal["started", "step", "stream_url", "module_ready", "warning", "heartbeat", "completed", "failed"]
ExampleId = Literal["match", "no_match", "hidden_fees", "blocked"]

Scalar = Union[str, int, float, bool]


def ev() -> ExtractedValue:
    return Field(default_factory=ExtractedValue)


# ---------------------------------------------------------------- shared building blocks
class ApiError(BaseModel):
    code: str
    message: str
    next_step: Optional[str] = None


class ErrorResponse(BaseModel):
    error: ApiError


class SourceRef(BaseModel):
    url: str
    portal: Optional[PortalId] = None
    captured_at: datetime
    snapshot_id: Optional[str] = None


class ExtractedValue(BaseModel):
    value: Optional[Scalar] = None
    passage: Optional[str] = None


class RentOption(BaseModel):
    sharing_type: SharingType
    ac: Optional[bool] = None
    monthly_rent: Optional[int] = None
    per_bed_stated: Optional[bool] = None
    passage: Optional[str] = None


class ListingFields(BaseModel):
    listing_id: str
    source: SourceRef
    portal: PortalId
    status: ListingStatus = "unknown"
    title: ExtractedValue = ev()
    operator_name: ExtractedValue = ev()
    address_text: ExtractedValue = ev()
    locality: ExtractedValue = ev()
    description: ExtractedValue = ev()
    gender_policy: ExtractedValue = ev()
    food_plan: ExtractedValue = ev()
    furnishing: ExtractedValue = ev()
    floor: ExtractedValue = ev()
    lat: Optional[float] = None
    lng: Optional[float] = None
    rent_options: list[RentOption] = Field(default_factory=list)
    deposit_amount: ExtractedValue = ev()
    deposit_months: ExtractedValue = ev()
    maintenance_monthly: ExtractedValue = ev()
    electricity_terms: ExtractedValue = ev()
    electricity_monthly: ExtractedValue = ev()
    ac_charge_monthly: ExtractedValue = ev()
    food_charge_monthly: ExtractedValue = ev()
    brokerage_amount: ExtractedValue = ev()
    brokerage_months: ExtractedValue = ev()
    notice_period_days: ExtractedValue = ev()
    lock_in_months: ExtractedValue = ev()
    amenities: list[str] = Field(default_factory=list)
    photo_urls: list[str] = Field(default_factory=list)
    posted_on: Optional[str] = None


# ---------------------------------------------------------------- Hero 1: matching
class FamilyResult(BaseModel):
    family: SignalFamily
    agreed: Optional[bool] = None
    detail: str


class PriceGap(BaseModel):
    sharing_type: SharingType
    ac: Optional[bool] = None
    rent_here: int
    rent_there: int
    difference: int
    comparable: bool
    note: Optional[str] = None


class MatchCandidate(BaseModel):
    candidate_id: str
    listing: ListingFields
    scope: MatchScope = "same_place"
    match_level: MatchLevel
    confidence: Confidence
    method: str
    families: list[FamilyResult]
    shared_sentences: list[str] = Field(default_factory=list)
    distance_m: Optional[float] = None
    price_gaps: list[PriceGap] = Field(default_factory=list)
    alternative_explanations: list[str] = Field(default_factory=list)
    user_decision: Optional[UserDecision] = None


class PortalCheck(BaseModel):
    portal: PortalId
    status: PortalCheckStatus
    listings_seen: int = 0
    note: Optional[str] = None
    url: Optional[str] = None


class MatchingResult(BaseModel):
    status: MatchStatus
    candidates: list[MatchCandidate] = Field(default_factory=list)
    portals_checked: list[PortalCheck] = Field(default_factory=list)
    nearby_listings_count: int = 0
    message: str


# ---------------------------------------------------------------- Hero 2: cost ladder
class CostLine(BaseModel):
    key: CostKey
    title: str
    label: CostLabel
    recurrence: Recurrence
    amount_min: Optional[int] = None
    amount_max: Optional[int] = None
    source: Optional[SourceRef] = None
    passage: Optional[str] = None
    assumption_text: Optional[str] = None
    question: Optional[str] = None
    display_value: Optional[str] = None


class CostLadder(BaseModel):
    status: LadderStatus
    rent_option_index: int = 0
    sharing_type: Optional[SharingType] = None
    lines: list[CostLine] = Field(default_factory=list)
    monthly_min: Optional[int] = None
    monthly_max: Optional[int] = None
    move_in_min: Optional[int] = None
    move_in_max: Optional[int] = None
    unknown_count: int = 0
    headline: str


# ---------------------------------------------------------------- supporting layer
class FairPriceResult(BaseModel):
    status: FairPriceStatus
    comparable_count: int = 0
    sharing_type: Optional[SharingType] = None
    median_rent: Optional[int] = None
    listing_rent: Optional[int] = None
    position: Optional[PricePosition] = None
    message: str


class QuestionItem(BaseModel):
    question_id: str
    text: str
    finding_id: Optional[str] = None
    is_default: bool = False


class Finding(BaseModel):
    finding_id: str
    kind: FindingKind
    what_we_saw: str
    sources: list[SourceRef] = Field(default_factory=list)
    how_we_matched: Optional[str] = None
    confidence: Optional[Confidence] = None
    other_explanations: list[str] = Field(default_factory=list)
    label: EvidenceLabel
    question: Optional[str] = None


class ModuleState(BaseModel):
    name: ModuleName
    status: ModuleStatus
    message: Optional[str] = None
    next_step: Optional[str] = None


# ---------------------------------------------------------------- the report
class Report(BaseModel):
    report_id: str
    status: JobStatus
    created_at: datetime
    captured_at: Optional[datetime] = None
    is_cached: bool = False
    is_replay: bool = False
    replay_label: Optional[str] = None
    input_url: str
    portal: Optional[PortalId] = None
    listing: Optional[ListingFields] = None
    matching: Optional[MatchingResult] = None
    cost: Optional[CostLadder] = None
    fair_price: Optional[FairPriceResult] = None
    questions: list[QuestionItem] = Field(default_factory=list)
    findings: list[Finding] = Field(default_factory=list)
    modules: list[ModuleState] = Field(default_factory=list)
    share_path: str = ""


# ---------------------------------------------------------------- API request/response + events
class InvestigateRequest(BaseModel):
    url: Optional[str] = None
    replay_example_id: Optional[ExampleId] = None
    force_refresh: bool = False


class InvestigateResponse(BaseModel):
    report_id: str
    cached: bool
    is_replay: bool


class DecisionRequest(BaseModel):
    candidate_id: str
    decision: UserDecision


class ExampleListing(BaseModel):
    example_id: ExampleId
    title: str
    description: str
    url: str
    portal: PortalId


class JobEvent(BaseModel):
    report_id: str
    type: JobEventType
    ts: datetime
    message: str
    module: Optional[ModuleName] = None
    portal: Optional[PortalId] = None
    stream_url: Optional[str] = None
    screenshot_url: Optional[str] = None
    progress: Optional[float] = None
    error: Optional[ApiError] = None


class PreflightCheck(BaseModel):
    name: str
    ok: bool
    detail: str


class PreflightResult(BaseModel):
    all_ok: bool
    checked_at: datetime
    checks: list[PreflightCheck]


# ================================================================ BACKEND ONLY
class CapturedPage(BaseModel):
    url: str
    final_url: str
    portal: Optional[PortalId] = None
    text: str = ""
    html: Optional[str] = None
    captured_at: datetime
    snapshot_id: Optional[str] = None
    ok: bool
    fetched_via: Literal["fetch", "agent"] = "fetch"
    error_code: Optional[str] = None
    error_message: Optional[str] = None


class SearchHit(BaseModel):
    url: str
    title: str
    snippet: str = ""
    portal: Optional[PortalId] = None


class AgentResult(BaseModel):
    success: bool
    status: str
    output: Optional[dict] = None
    steps: int = 0
    stream_url: Optional[str] = None
    error_code: Optional[str] = None


class WalletInfo(BaseModel):
    ok: bool
    balance_usd: Optional[float] = None