import type { CostLadder, SourceRef } from '../../types/api';

function formatRupees(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

interface CostLadderViewProps {
  ladder: CostLadder;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function CostLadderView({ ladder, onOpenEvidence }: CostLadderViewProps) {
  if (!ladder) return null;

  const ladderData = ladder as any;
  const items: any[] = ladderData?.items || ladderData?.rows || [];
  const headline = ladderData?.headline || ladderData?.title || 'Move-in & Monthly Cost Breakdown';
  const totalFirstMonth = ladderData?.total_first_month ?? ladderData?.first_month_total;
  const monthlyRecurring = ladderData?.monthly_recurring ?? ladderData?.monthly_total;

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
            Real Cost Breakdown
          </span>
          <h3 className="text-base font-bold text-[#1A261C]">
            {headline}
          </h3>
        </div>
        {totalFirstMonth !== undefined && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#1A261C]/60 block">
              1st Month Total
            </span>
            <span className="text-lg font-extrabold text-[#B80D1D]">
              {formatRupees(totalFirstMonth)}
            </span>
          </div>
        )}
      </div>

      {/* Cost Ladder Table / Items */}
      <div className="space-y-2">
        {items.map((item: any, idx: number) => {
          const isHidden = item?.is_hidden_cost || item?.hidden;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isHidden
                  ? 'bg-[#B80D1D]/5 border-[#B80D1D]/30'
                  : 'bg-white border-[#F4EFEA]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1A261C]">
                    {item?.label || item?.name || 'Cost Item'}
                  </span>
                  {isHidden && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#B80D1D] text-white px-1.5 py-0.2 rounded">
                      Hidden Fee
                    </span>
                  )}
                </div>
                {item?.note && (
                  <p className="text-[11px] text-[#1A261C]/70">{item.note}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    isHidden ? 'text-[#B80D1D]' : 'text-[#1A261C]'
                  }`}
                >
                  {formatRupees(item?.amount)}
                </span>

                {item?.source && onOpenEvidence && (
                  <button
                    type="button"
                    onClick={() => onOpenEvidence(item.source)}
                    className="text-[11px] text-[#B80D1D] hover:underline font-semibold"
                  >
                    Evidence
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Recurring Total Footer */}
      {monthlyRecurring !== undefined && (
        <div className="flex items-center justify-between bg-[#F4EFEA]/80 p-3 rounded-lg border border-[#F4EFEA]">
          <span className="text-xs font-bold text-[#1A261C]">
            Estimated Monthly Total (Rent + Mandatory Add-ons)
          </span>
          <span className="text-sm font-extrabold text-[#1A261C]">
            {formatRupees(monthlyRecurring)} / mo
          </span>
        </div>
      )}
    </div>
  );
}