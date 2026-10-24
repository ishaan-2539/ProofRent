import type { SourceRef } from '../../types/api';

interface CostStepProps {
  item: {
    key?: string;
    title?: string;
    label?: string;
    name?: string;
    recurrence?: string;
    amount_min?: number | null;
    amount_max?: number | null;
    amount?: number;
    display_value?: string | null;
    is_hidden_cost?: boolean;
    hidden?: boolean;
    passage?: string | null;
    assumption_text?: string | null;
    question?: string | null;
    note?: string;
    source?: SourceRef | null;
  };
  onOpenEvidence?: (source: SourceRef) => void;
}

const fmt = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

export function CostStep({ item, onOpenEvidence }: CostStepProps) {
  if (!item) return null;

  const title = item.title || item.name || item.key || 'Expense Item';
  const min = item.amount_min ?? item.amount ?? null;
  const max = item.amount_max ?? null;

  const isAssumed = item.label === 'assumed' || item.is_hidden_cost || item.hidden;
  const isUnknown = item.label === 'unknown' || (min === null && !item.display_value);

  let amountText: string;
  if (item.display_value && min === null) {
    amountText = item.display_value;
  } else if (isUnknown || min === null) {
    amountText = 'Unknown';
  } else if (max !== null && max !== min) {
    amountText = `${fmt(min)} – ${fmt(max)}`;
  } else {
    amountText = fmt(min);
  }

  const dot = isUnknown ? 'bg-slate-400' : isAssumed ? 'bg-amber-400' : 'bg-emerald-500';
  const tag = isUnknown ? 'Unknown' : isAssumed ? 'Assumed' : 'Listed';
  const recurrence =
    item.recurrence === 'monthly' ? '/mo' : item.recurrence === 'one_time' ? 'one-time' : '';

  const noteText = item.passage || item.assumption_text || item.note;

  return (
    <div className="py-3 space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} title={tag} />
          <span className="text-sm text-[#1A261C]/85 truncate">{title}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A261C]/40 shrink-0">
            {tag}
            {recurrence ? ` · ${recurrence}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {item.source && onOpenEvidence && (
            <button
              type="button"
              onClick={() => onOpenEvidence(item.source!)}
              className="text-[10px] font-mono font-bold text-[#B80D1D] hover:underline"
            >
              Proof ↗
            </button>
          )}
          <span
            className={`text-sm font-bold ${isUnknown ? 'text-[#1A261C]/40' : 'text-[#1A261C]'}`}
          >
            {amountText}
          </span>
        </div>
      </div>

      {noteText && (
        <p className="text-[11px] text-[#1A261C]/55 italic leading-relaxed pl-4">"{noteText}"</p>
      )}
      {isUnknown && item.question && (
        <p className="text-[11px] text-amber-800 pl-4">
          <span className="font-bold">Ask:</span> {item.question}
        </p>
      )}
    </div>
  );
}