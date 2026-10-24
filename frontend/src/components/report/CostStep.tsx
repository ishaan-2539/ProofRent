import type { SourceRef } from '../../types/api';

interface CostStepProps {
  item: {
    key?: string;
    title?: string;
    label?: string;
    name?: string;
    amount_min?: number;
    amount?: number;
    is_hidden_cost?: boolean;
    hidden?: boolean;
    passage?: string;
    assumption_text?: string;
    question?: string;
    note?: string;
    source?: SourceRef;
  };
  onOpenEvidence?: (source: SourceRef) => void;
}

export function CostStep({ item, onOpenEvidence }: CostStepProps) {
  if (!item) return null;

  const title = item.title || item.name || item.key || 'Expense Item';
  const amount = item.amount_min ?? item.amount ?? 0;
  
  // Classify line label: Listed (verified on page), Assumed (derived rule), or Unknown (requires question)
  const isAssumed = item.label === 'assumed' || item.is_hidden_cost || item.hidden;
  const isUnknown = item.label === 'unknown' || (amount === 0 && !!item.question);
  
  const noteText = item.passage || item.assumption_text || item.note || item.question;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isUnknown
          ? 'bg-amber-50/60 border-amber-200/80'
          : isAssumed
          ? 'bg-[#B80D1D]/5 border-[#B80D1D]/30'
          : 'bg-white border-[#F4EFEA] hover:border-[#1A261C]/20'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#1A261C]">{title}</span>

          {isUnknown ? (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              Unknown — Ask Landlord
            </span>
          ) : isAssumed ? (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#B80D1D] text-white px-2 py-0.5 rounded-full">
              Assumed / Hidden Fee
            </span>
          ) : (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#1A261C] text-white px-2 py-0.5 rounded-full">
              Verified Listed
            </span>
          )}
        </div>

        {noteText && (
          <p className="text-[11px] text-[#1A261C]/70 italic leading-relaxed">
            "{noteText}"
          </p>
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F4EFEA]">
        {item.source && onOpenEvidence && (
          <button
            type="button"
            onClick={() => onOpenEvidence(item.source!)}
            className="text-[10px] font-mono font-bold text-[#B80D1D] hover:underline"
          >
            Proof ↗
          </button>
        )}

        <div className="font-display text-sm font-extrabold text-[#1A261C]">
          {isUnknown ? '₹ Range Pending' : `₹${Number(amount).toLocaleString('en-IN')}`}
        </div>
      </div>
    </div>
  );
}