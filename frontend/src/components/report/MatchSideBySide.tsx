
import type { ListingFields, UserDecision, SourceRef } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';
import { MapPinsView } from './MapPinsView';
import { HighlightedText } from './HighlightedText';

// Helper to safely render plain text or ExtractedValue objects
function getText(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.value !== undefined) return String(val.value);
  return '';
}

interface MatchSideBySideProps {
  listing: ListingFields;
  candidate: any;
  onDecision: (candidateId: string, d: UserDecision) => void;
  onOpenEvidence: (source: SourceRef) => void;
}

export function MatchSideBySide({ listing, candidate, onDecision, onOpenEvidence }: MatchSideBySideProps) {
  const currentDecision = candidate?.user_decision || 'unreviewed';

  const listingTitle = getText((listing as any)?.title) || 'Submitted Listing';
  const listingAddress = getText((listing as any)?.address) || 'Address not listed';
  const listingDesc = getText((listing as any)?.description);

  const candidateTitle = getText(candidate?.title) || 'Matched Listing Title';
  const candidateAddress = getText(candidate?.address) || 'Address not listed';
  const candidateDesc = getText(candidate?.description);

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[#F4EFEA]">
        <div>
          <span className="text-xs font-bold text-[#B80D1D] uppercase tracking-wider">
            Potential Duplicate / Listed Property
          </span>
          <h3 className="text-base font-bold text-[#1A261C]">
            {candidateTitle}
          </h3>
        </div>

        {/* User Decision Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecision(candidate.candidate_id, 'confirm' as UserDecision)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentDecision === 'confirm'
                ? 'bg-[#1A261C] text-white shadow'
                : 'bg-[#F4EFEA] text-[#1A261C] hover:bg-[#1A261C]/10'
            }`}
          >
            ✓ Confirm Match
          </button>
          <button
            type="button"
            onClick={() => onDecision(candidate.candidate_id, 'reject' as UserDecision)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentDecision === 'reject'
                ? 'bg-[#B80D1D] text-white shadow'
                : 'bg-[#F4EFEA] text-[#1A261C] hover:bg-[#B80D1D]/10'
            }`}
          >
            ✕ Reject
          </button>
        </div>
      </div>

      {/* Signal Chips */}
      {candidate.family_results && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/60">
            Signal Family Alignment
          </span>
          <SignalChips families={candidate.family_results} />
        </div>
      )}

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Left Side: This Listing */}
        <div className="bg-white border border-[#F4EFEA] rounded-lg p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/50">
            This Listing (Under Verification)
          </span>
          <h4 className="text-sm font-semibold text-[#1A261C]">
            {listingTitle}
          </h4>
          <p className="text-xs text-[#1A261C]/70">
            {listingAddress}
          </p>
          <HighlightedText text={listingDesc} />
        </div>

        {/* Right Side: Matched Candidate */}
        <div className="bg-white border border-[#F4EFEA] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
              Matched Source ({candidate.source_platform || 'External Platform'})
            </span>
            {candidate.url && (
              <button
                type="button"
                onClick={() => onOpenEvidence({ url: candidate.url, platform: candidate.source_platform } as any)}
                className="text-[11px] font-semibold text-[#B80D1D] hover:underline"
              >
                View Source ↗
              </button>
            )}
          </div>
          <h4 className="text-sm font-semibold text-[#1A261C]">
            {candidateTitle}
          </h4>
          <p className="text-xs text-[#1A261C]/70">
            {candidateAddress}
          </p>
          <HighlightedText text={candidateDesc} />
        </div>
      </div>

      {/* Price Gaps & Location Proximity */}
      {candidate.price_gaps && candidate.price_gaps.length > 0 && (
        <PriceGapBadge gaps={candidate.price_gaps} />
      )}

      {((listing as any)?.lat || candidate?.lat) && (
        <MapPinsView
          a={{ lat: ((listing as any)?.lat as any)?.value ?? (listing as any)?.lat ?? null, lng: ((listing as any)?.lng as any)?.value ?? (listing as any)?.lng ?? null }}
          b={{ lat: candidate?.lat ?? null, lng: candidate?.lng ?? null }}
          distanceM={candidate?.distance_m ?? null}
        />
      )}
    </div>
  );
}