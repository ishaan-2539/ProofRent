import type { Finding, SourceRef } from '../../types/api';

interface FindingCardProps {
  finding: Finding;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function FindingCard({ finding, onOpenEvidence }: FindingCardProps) {
  if (!finding) return null;

  const confidence = finding.confidence || 'medium';
  const confidenceColor =
    confidence === 'high'
      ? 'bg-[#B80D1D] text-white'
      : confidence === 'medium'
      ? 'bg-[#1A261C] text-white'
      : 'bg-[#F4EFEA] text-[#1A261C]';

  return (
    <div className="bg-white border-2 border-[#1A261C]/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Top Banner: Kind & Confidence */}
      <div className="flex items-center justify-between gap-3 border-b border-[#F4EFEA] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D] animate-ping shrink-0" />
          <h4 className="text-base font-extrabold text-[#1A261C] tracking-tight">
            {finding.label || 'Verification Finding Discrepancy'}
          </h4>
        </div>
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${confidenceColor}`}>
          {confidence} Confidence
        </span>
      </div>

      {/* Grid: What We Saw vs How Matched */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What We Saw */}
        {finding.what_we_saw && (
          <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
              🚨 Observed Discrepancy
            </span>
            <p className="text-xs text-[#1A261C] leading-relaxed font-medium">
              {finding.what_we_saw}
            </p>
          </div>
        )}

        {/* How We Matched */}
        {finding.how_we_matched && (
          <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/60">
              🔍 Matching Methodology
            </span>
            <p className="text-xs text-[#1A261C]/80 leading-relaxed">
              {finding.how_we_matched}
            </p>
          </div>
        )}
      </div>

      {/* Innocent Explanations */}
      {finding.other_explanations && finding.other_explanations.length > 0 && (
        <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3.5 rounded-r-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]">
            💡 Alternative Explanation
          </span>
          <p className="text-xs text-[#1A261C]/80 italic">
            "{finding.other_explanations[0]}"
          </p>
        </div>
      )}

      {/* Bottom Action: Question & Source Proof */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F4EFEA]">
        {finding.question && (
          <div className="text-xs text-[#1A261C] font-semibold flex items-center gap-2">
            <span className="text-[#B80D1D] font-mono font-bold">Ask:</span>
            <span>"{finding.question}"</span>
          </div>
        )}

        {finding.sources && finding.sources.length > 0 && onOpenEvidence && (
          <button
            type="button"
            onClick={() => onOpenEvidence(finding.sources![0])}
            className="text-xs font-bold text-white bg-[#1A261C] hover:bg-[#1A261C]/90 px-3.5 py-1.5 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
          >
            View Evidence Proof ↗
          </button>
        )}
      </div>
    </div>
  );
}