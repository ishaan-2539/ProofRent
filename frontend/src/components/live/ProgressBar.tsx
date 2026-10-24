import type { ModuleState, ModuleName } from '../../types/api';

interface ProgressBarProps {
  modules: ModuleState[];
}

const ORDERED_MODULES: { key: ModuleName; label: string }[] = [
  { key: 'listing', label: '1. Extraction' },
  { key: 'matching', label: '2. Duplicate Search' },
  { key: 'cost', label: '3. Cost Ladder' },
  { key: 'fair_price', label: '4. Fair Valuation' },
  { key: 'questions', label: '5. Playbook' },
];

export function ProgressBar({ modules }: ProgressBarProps) {
  const getStatus = (key: ModuleName) => {
    const found = modules?.find((m) => m.name === key);
    return found ? found.status : 'pending';
  };

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-2xl p-4 shadow-luxury">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ORDERED_MODULES.map(({ key, label }) => {
          const status = getStatus(key);
          const isDone = status === 'success';
          const isWorking = status === 'working';
          const isFailed = status === 'failed';

          return (
            <div
              key={key}
              className={`p-3 rounded-xl border text-center transition-all ${
                isDone
                  ? 'bg-[#1A261C] border-[#1A261C] text-[#FAF8F5]'
                  : isWorking
                  ? 'bg-[#B80D1D]/10 border-[#B80D1D] text-[#B80D1D]'
                  : isFailed
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-[#FAF8F5] border-[#F4EFEA] text-[#1A261C]/50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                {isWorking && (
                  <span className="w-2 h-2 rounded-full bg-[#B80D1D] animate-ping" />
                )}
                <span className="text-[11px] font-mono font-bold tracking-tight">
                  {label}
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider block mt-1 font-semibold opacity-80">
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}