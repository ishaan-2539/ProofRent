import React from "react";

interface ReplayBannerProps {
  label?: string | null;
}

export const ReplayBanner: React.FC<ReplayBannerProps> = ({ label }) => {
  return (
    <div className="w-full bg-[#1A261C] text-[#FAF8F5] px-4 py-2.5 border-b border-[#E9DEC3]/20 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-[#B80D1D] text-white">
          Replay Mode
        </span>
        <span className="font-medium text-[#FAF8F5]/90">
          {label || "Recorded investigation run served from verified snapshot fixtures."}
        </span>
      </div>
      <span className="text-[11px] font-mono text-[#FAF8F5]/60 hidden sm:inline">
        Offline Deterministic Execution
      </span>
    </div>
  );
};