export type PortalId = "magicbricks" | "pgdekho" | "nobroker" | "housing" | "gopgo" | "hexahome" | "ninetynineacres";
export type EvidenceLabel = "verified" | "inferred" | "uncertain" | "unknown";
export type Confidence = "high" | "medium" | "low";
export type SharingType = "single" | "double" | "triple" | "quad" | "other";
export type ListingStatus = "live" | "removed" | "unknown";
export type SignalFamily = "location" | "identity" | "content" | "visual";
export type MatchLevel = "match" | "possible";
export type MatchScope = "same_place" | "same_operator_branch";
export type MatchStatus = "match_found" | "possible_match" | "several_candidates" | "no_match" | "not_checked";
export type PortalCheckStatus = "checked" | "blocked" | "failed" | "skipped" | "unsupported";
export type UserDecision = "confirmed" | "rejected";
export type CostKey = "rent" | "deposit" | "food" | "electricity" | "ac" | "maintenance" | "brokerage" | "notice_period" | "lock_in";
export type CostLabel = "listed" | "assumed" | "unknown";
export type Recurrence = "monthly" | "one_time" | "terms";
export type LadderStatus = "ok" | "rent_missing" | "failed";
export type PricePosition = "below" | "near" | "above";
export type FairPriceStatus = "ok" | "not_enough_data";
export type FindingKind = "same_place" | "cost" | "fair_price" | "listing_status";
export type ModuleName = "listing" | "matching" | "cost" | "fair_price" | "questions";
export type ModuleStatus = "pending" | "working" | "success" | "partial" | "empty" | "failed" | "not_checked";
export type JobStatus = "queued" | "running" | "completed" | "partial" | "failed";
export type JobEventType = "started" | "step" | "stream_url" | "module_ready" | "warning" | "heartbeat" | "completed" | "failed";
export type ExampleId = "match" | "no_match" | "hidden_fees" | "blocked";
export type Scalar = string | number | boolean;

export interface ApiError { code: string; message: string; next_step: string | null }
export interface ErrorResponse { error: ApiError }
export interface SourceRef { url: string; portal: PortalId | null; captured_at: string; snapshot_id: string | null }
export interface ExtractedValue { value: Scalar | null; passage: string | null }
export interface RentOption {
  sharing_type: SharingType; ac: boolean | null; monthly_rent: number | null;
  per_bed_stated: boolean | null; passage: string | null;
}
export interface ListingFields {
  listing_id: string; source: SourceRef; portal: PortalId; status: ListingStatus;
  title: ExtractedValue; operator_name: ExtractedValue; address_text: ExtractedValue; locality: ExtractedValue;
  description: ExtractedValue; gender_policy: ExtractedValue; food_plan: ExtractedValue; furnishing: ExtractedValue;
  floor: ExtractedValue; lat: number | null; lng: number | null; rent_options: RentOption[];
  deposit_amount: ExtractedValue; deposit_months: ExtractedValue; maintenance_monthly: ExtractedValue;
  electricity_terms: ExtractedValue; electricity_monthly: ExtractedValue; ac_charge_monthly: ExtractedValue;
  food_charge_monthly: ExtractedValue; brokerage_amount: ExtractedValue; brokerage_months: ExtractedValue;
  notice_period_days: ExtractedValue; lock_in_months: ExtractedValue;
  amenities: string[]; photo_urls: string[]; posted_on: string | null;
}
export interface FamilyResult { family: SignalFamily; agreed: boolean | null; detail: string }
export interface PriceGap {
  sharing_type: SharingType; ac: boolean | null; rent_here: number; rent_there: number;
  difference: number; comparable: boolean; note: string | null;
}
export interface MatchCandidate {
  candidate_id: string; listing: ListingFields; scope: MatchScope; match_level: MatchLevel; confidence: Confidence;
  method: string; families: FamilyResult[]; shared_sentences: string[]; distance_m: number | null;
  price_gaps: PriceGap[]; alternative_explanations: string[]; user_decision: UserDecision | null;
}
export interface PortalCheck { portal: PortalId; status: PortalCheckStatus; listings_seen: number; note: string | null; url: string | null }
export interface MatchingResult {
  status: MatchStatus; candidates: MatchCandidate[]; portals_checked: PortalCheck[];
  nearby_listings_count: number; message: string;
}
export interface CostLine {
  key: CostKey; title: string; label: CostLabel; recurrence: Recurrence;
  amount_min: number | null; amount_max: number | null; source: SourceRef | null; passage: string | null;
  assumption_text: string | null; question: string | null; display_value: string | null;
}
export interface CostLadder {
  status: LadderStatus; rent_option_index: number; sharing_type: SharingType | null; lines: CostLine[];
  monthly_min: number | null; monthly_max: number | null; move_in_min: number | null; move_in_max: number | null;
  unknown_count: number; headline: string;
}
export interface FairPriceResult {
  status: FairPriceStatus; comparable_count: number; sharing_type: SharingType | null;
  median_rent: number | null; listing_rent: number | null; position: PricePosition | null; message: string;
}
export interface QuestionItem { question_id: string; text: string; finding_id: string | null; is_default: boolean }
export interface Finding {
  finding_id: string; kind: FindingKind; what_we_saw: string; sources: SourceRef[];
  how_we_matched: string | null; confidence: Confidence | null; other_explanations: string[];
  label: EvidenceLabel; question: string | null;
}
export interface ModuleState { name: ModuleName; status: ModuleStatus; message: string | null; next_step: string | null }
export interface Report {
  report_id: string; status: JobStatus; created_at: string; captured_at: string | null;
  is_cached: boolean; is_replay: boolean; replay_label: string | null; input_url: string; portal: PortalId | null;
  listing: ListingFields | null; matching: MatchingResult | null; cost: CostLadder | null;
  fair_price: FairPriceResult | null; questions: QuestionItem[]; findings: Finding[];
  modules: ModuleState[]; share_path: string;
}
export interface InvestigateRequest { url: string | null; replay_example_id: ExampleId | null; force_refresh: boolean }
export interface InvestigateResponse { report_id: string; cached: boolean; is_replay: boolean }
export interface DecisionRequest { candidate_id: string; decision: UserDecision }
export interface ExampleListing { example_id: ExampleId; title: string; description: string; url: string; portal: PortalId }
export interface JobEvent {
  report_id: string; type: JobEventType; ts: string; message: string; module: ModuleName | null;
  portal: PortalId | null; stream_url: string | null; screenshot_url: string | null;
  progress: number | null; error: ApiError | null;
}
export interface PreflightCheck { name: string; ok: boolean; detail: string }
export interface PreflightResult { all_ok: boolean; checked_at: string; checks: PreflightCheck[] }