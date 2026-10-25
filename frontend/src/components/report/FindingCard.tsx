import type { Finding, FindingKind, SourceRef } from '../../types/api';
import { EvidenceLabelBadge } from '../common/EvidenceLabelBadge';

interface FindingCardProps {
  finding: Finding;
  onOpenEvidence?: (source: SourceRef) => void;
}

const KIND_TITLE: Record<FindingKind, string> = {
  same_place: 'Same place, different price',
  cost: 'Costs beyond the listed rent',
  fair_price: 'Compared with similar listings',
  listing_status: 'Listing status',
};

export function FindingCard({ finding, onOpenEvidence }: FindingCardProps) {
  if (!finding) return null;

  return (
    <div className="bg-white border-2 border-[#1A261C]/10 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-[#F4EFEA] pb-3">
        <h4 className="text-base font-extrabold text-[#1A261C] tracking-tight">
          {KIND_TITLE[finding.kind] || 'Finding'}
        </h4>
        <div className="flex items-center gap-2 shrink-0">
          {finding.confidence && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#1A261C] text-white">
              {finding.confidence} confidence
            </span>
          )}
          <EvidenceLabelBadge label={finding.label} />
        </div>
      </div>

      <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">What we saw</span>
        <p className="text-sm text-[#1A261C] leading-relaxed font-medium">{finding.what_we_saw}</p>
      </div>

      {finding.how_we_matched && (
        <p className="text-xs text-[#1A261C]/65">
          <span className="font-bold text-[#1A261C]">How we matched: </span>
          {finding.how_we_matched}
        </p>
      )}

      {finding.other_explanations?.length > 0 && (
        <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3.5 rounded-r-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]">
            Other possible explanations
          </span>
          <ul className="text-xs text-[#1A261C]/75 list-disc pl-4 space-y-0.5">
            {finding.other_explanations.slice(0, 3).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F4EFEA]">
        {finding.question ? (
          <div className="text-xs text-[#1A261C] font-semibold">
            <span className="text-[#B80D1D] font-mono font-bold">Ask: </span>
            {finding.question}
          </div>
        ) : (
          <span />
        )}
        {finding.sources?.length > 0 && onOpenEvidence && (
          <button
            type="button"
            onClick={() => onOpenEvidence(finding.sources[0])}
            className="text-xs font-bold text-white bg-[#1A261C] hover:bg-[#1A261C]/90 px-3.5 py-1.5 rounded-lg transition-colors shrink-0"
          >
            View evidence ↗
          </button>
        )}
      </div>
    </div>
  );
}