import { useState, useEffect } from 'react';
import type { CostLadder, SourceRef } from '../../types/api';
import { CostStep } from './CostStep';

interface CostLadderViewProps {
  ladder: CostLadder;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function CostLadderView({ ladder, onOpenEvidence }: CostLadderViewProps) {
  if (!ladder) return null;

  const lad = ladder as any;
  const headline = ladder.headline || 'Move-in & Monthly Financial Obligations';

  const totalFirstMonth = ladder.move_in_min ?? lad.total_first_month ?? 0;
  const monthlyRecurring = ladder.monthly_min ?? lad.monthly_recurring ?? 0;
  const items: any[] = ladder.lines || lad.items || [];

  // Animated tally count-up state for demo presentation
  const [animatedFirstMonth, setAnimatedFirstMonth] = useState<number>(0);
  const [animatedMonthly, setAnimatedMonthly] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    
    const incrementFirstMonth = totalFirstMonth / steps;
    const incrementMonthly = monthlyRecurring / steps;

    const timer = setInterval(() => {
      start++;
      setAnimatedFirstMonth((prev) => Math.min(totalFirstMonth, Math.floor(prev + incrementFirstMonth)));
      setAnimatedMonthly((prev) => Math.min(monthlyRecurring, Math.floor(prev + incrementMonthly)));

      if (start >= steps) {
        setAnimatedFirstMonth(totalFirstMonth);
        setAnimatedMonthly(monthlyRecurring);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalFirstMonth, monthlyRecurring]);

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Financial Breakdown Audit
          </span>
          <h3 className="font-display font-extrabold text-lg text-[#1A261C]">
            {headline}
          </h3>
        </div>
        <span className="text-xs font-bold bg-[#FAF8F5] border border-[#F4EFEA] text-[#1A261C] px-3 py-1 rounded-full shadow-sm">
          {items.length} Line Items
        </span>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1A261C] to-[#121B13] text-white shadow-md space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FAF8F5]/70">
            Total First Month Outlay
          </span>
          <div className="font-display text-2xl font-extrabold text-[#FAF8F5]">
            ₹{animatedFirstMonth.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#FAF8F5]/60">Includes rent, security deposit & fees</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E9DEC3] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Est. Monthly Recurring
          </span>
          <div className="font-display text-2xl font-extrabold text-[#1A261C]">
            ₹{animatedMonthly.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#1A261C]/60">Base rent + recurring obligations</p>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A261C]/50">
          Itemized Outlay Breakdown
        </h4>
        <div className="space-y-2.5">
          {items.map((item: any, idx: number) => (
            <CostStep
              key={idx}
              item={item}
              onOpenEvidence={onOpenEvidence}
            />
          ))}
        </div>
      </div>
    </div>
  );
}