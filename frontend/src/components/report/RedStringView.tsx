
import type { ListingFields, MatchingResult, UserDecision, SourceRef } from '../../types/api';
import { FindingCard } from './FindingCard';
import { MatchSideBySide } from './MatchSideBySide';

interface RedStringViewProps {
  listing: ListingFields;
  matching: MatchingResult;
  onDecision: (candidateId: string, d: UserDecision) => void;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function RedStringView({ listing, matching, onDecision, onOpenEvidence }: RedStringViewProps) {
  const handleOpenEvidence = (source: SourceRef) => {
    if (onOpenEvidence) {
      onOpenEvidence(source);
    }
  };

  const candidates = matching?.candidates || [];
  const findings: any[] = (matching as any)?.findings || [];

  return (
    <div className="space-y-6">
      {/* Candidates List */}
      {candidates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]/80">
            Matched Property Candidates ({candidates.length})
          </h3>
          <div className="space-y-4">
            {candidates.map((cand: any) => (
              <MatchSideBySide
                key={cand.candidate_id}
                listing={listing}
                candidate={cand}
                onDecision={onDecision}
                onOpenEvidence={handleOpenEvidence}
              />
            ))}
          </div>
        </div>
      )}

      {/* Findings Section */}
      {findings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]/80">
            Key Verification Findings ({findings.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {findings.map((f: any, idx: number) => (
              <FindingCard
                key={idx}
                finding={f}
                onOpenEvidence={handleOpenEvidence}
              />
            ))}
          </div>
        </div>
      )}

      {candidates.length === 0 && findings.length === 0 && (
        <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-8 text-center text-xs text-[#1A261C]/60">
          No red string matches or findings detected for this listing.
        </div>
      )}
    </div>
  );
}