import React from "react";
import type { ModuleState, ModuleName } from "@/types/api";

interface ProgressBarProps {
  modules?: ModuleState[];
}

const DEFAULT_MODULES: ModuleName[] = [
  "listing",
  "matching",
  "cost",
  "fair_price",
  "questions",
];

const MODULE_TITLES: Record<ModuleName, string> = {
  listing: "Extraction",
  matching: "Cross-Matching",
  cost: "Cost Ladder",
  fair_price: "Fair Price",
  questions: "Tenant Playbook",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ modules = [] }) => {
  const getStatus = (name: ModuleName) => {
    const found = modules.find((m) => m.name === name);
    return found ? found.status : "pending";
  };

  const completedCount = DEFAULT_MODULES.filter((m) => {
    const st = getStatus(m);
    return st === "success" || st === "partial" || st === "empty";
  }).length;

  const percent = Math.round((completedCount / DEFAULT_MODULES.length) * 100);

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-2xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Live Pipeline Status
          </span>
          <h3 className="text-sm font-extrabold text-[#1A261C]">
            Investigation Engine Progress ({percent}%)
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#1A261C] bg-[#FAF8F5] border border-[#F4EFEA] px-2.5 py-1 rounded-lg">
          {completedCount} / {DEFAULT_MODULES.length} Modules Ready
        </span>
      </div>

      <div className="w-full bg-[#F4EFEA] h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#B80D1D] via-[#C80D2E] to-[#1A261C] h-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {DEFAULT_MODULES.map((name) => {
          const st = getStatus(name);

          let bg = "bg-[#FAF8F5] text-[#1A261C]/50 border-[#F4EFEA]";
          let icon = "⏳";

          if (st === "working") {
            bg = "bg-amber-50 text-amber-900 border-amber-200 animate-pulse";
            icon = "⚡";
          } else if (st === "success") {
            bg = "bg-emerald-50 text-emerald-900 border-emerald-200 font-bold";
            icon = "✓";
          } else if (st === "partial" || st === "empty") {
            bg = "bg-slate-100 text-slate-800 border-slate-200 font-semibold";
            icon = "ℹ";
          } else if (st === "failed") {
            bg = "bg-rose-50 text-rose-900 border-rose-200 font-bold";
            icon = "✕";
          }

          return (
            <div
              key={name}
              className={`p-2.5 rounded-xl border text-center text-xs transition-all ${bg}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-xs">{icon}</span>
                <span className="font-bold text-[11px] truncate">
                  {MODULE_TITLES[name]}
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider block opacity-70">
                {st}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};