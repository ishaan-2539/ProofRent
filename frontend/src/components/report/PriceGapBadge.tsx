import React from 'react';
import { PriceGap } from '../../types/api';

function formatRupees(n: number | null): string {
  if (n === null || n === undefined) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

export function PriceGapBadge({ gaps }: { gaps: PriceGap[] }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {gaps.map((gap, idx) => {
        const isDiff = gap.difference !== 0;
        const higherHere = gap.difference < 0;

        return (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 bg-[#FAFAFC] border border-[#F4EFEA] p-2.5 rounded-lg text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1A261C] capitalize">
                {gap.sharing_type} room {gap.ac ? '(AC)' : ''}
              </span>
              <span className="text-[#1A261C]/60">
                {formatRupees(gap.rent_here)} vs {formatRupees(gap.rent_there)}
              </span>
            </div>

            {gap.comparable ? (
              <span
                className={`font-bold px-2 py-0.5 rounded text-xs ${
                  isDiff
                    ? higherHere
                      ? 'bg-[#B80D1D]/10 text-[#B80D1D] border border-[#B80D1D]/30'
                      : 'bg-[#1A261C]/10 text-[#1A261C] border border-[#1A261C]/30'
                    : 'bg-[#F4EFEA] text-[#1A261C]'
                }`}
              >
                {gap.difference > 0
                  ? `+${formatRupees(gap.difference)} gap`
                  : gap.difference < 0
                  ? `${formatRupees(gap.difference)} gap`
                  : 'Same price'}
              </span>
            ) : (
              <span className="text-[11px] text-[#1A261C]/60 italic">
                {gap.note || 'Shown as stated'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}