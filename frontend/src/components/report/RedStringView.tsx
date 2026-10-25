import type { ListingFields, MatchingResult, UserDecision, SourceRef } from '../../types/api';
import { ListingCard, MatchSideBySide } from './MatchSideBySide';
import { getPortalName } from '../../lib/labels';

interface RedStringViewProps {
  reportId?: string;
  listing: ListingFields;
  matching: MatchingResult;
  onDecision: (candidateId: string, d: UserDecision) => void;
  onOpenEvidence?: (source: SourceRef) => void;
}

const STATUS_TEXT: Record<string, string> = {
  checked: 'Searched, nothing found',
  blocked: 'Blocked automated access',
  failed: 'Search failed',
  skipped: 'Skipped',
  unsupported: 'Not supported',
};

export function RedStringView({ listing, matching, onDecision, onOpenEvidence }: RedStringViewProps) {
  const candidates = matching?.candidates || [];
  const portals = matching?.portals_checked || [];
  const hasListing = !!listing?.source;

  // The ReportView already sends the decision to the backend; this component only forwards it.
  if (candidates.length > 0) {
    return (
      <div className="space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]/80">
          Matched listings on other portals ({candidates.length})
        </h3>
        {matching.message && <p className="text-xs text-[#1A261C]/60">{matching.message}</p>}
        {candidates.map((cand) => (
          <MatchSideBySide
            key={cand.candidate_id}
            listing={listing}
            candidate={cand}
            onDecision={onDecision}
            onOpenEvidence={onOpenEvidence}
          />
        ))}
      </div>
    );
  }

  // No candidates: show the listing itself plus an honest account of what was searched.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {hasListing && (
        <ListingCard
          listing={listing}
          badge="Your link"
          badgeClass="bg-emerald-100 text-emerald-800 border border-emerald-300"
          onOpenEvidence={onOpenEvidence}
        />
      )}

      <div className="rounded-3xl bg-[#FAF8F5] border-2 border-dashed border-[#E9DEC3] p-6 space-y-4">
        <div>
          <h4 className="text-lg font-extrabold text-[#1A261C]">
            {matching?.status === 'not_checked' ? 'Other portals not checked' : 'No matching listing found'}
          </h4>
          <p className="text-sm text-[#1A261C]/65 mt-1">
            {matching?.message || 'No other listing was linked to this property.'}
          </p>
          <p className="text-xs text-[#1A261C]/45 mt-2">
            This means no match was found in the pages we could read. It does not prove the place is
            listed only once.
          </p>
        </div>

        {portals.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#1A261C]/45">Portals searched</h5>
            {portals.map((p) => (
              <div key={p.portal} className="flex items-start justify-between gap-3 text-xs">
                <span className="font-semibold text-[#1A261C]">{getPortalName(p.portal)}</span>
                <span className="text-[#1A261C]/55 text-right">{p.note || STATUS_TEXT[p.status] || p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}