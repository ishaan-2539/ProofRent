import { useState } from 'react';

interface ShareBarProps {
  report: any;
}

export function ShareBar({ report }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const sharePath = report?.share_path || window.location.pathname;
  const fullUrl = `${window.location.origin}${sharePath}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#1A261C] text-white rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap shadow-lg border border-[#1A261C]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <span className="text-base">🛡️</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4EFEA]">
              ProofRent Verified Audit
            </h4>
            <span className="text-[9px] font-mono font-semibold bg-[#B80D1D] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Immutable Report
            </span>
          </div>
          <p className="text-xs text-[#F4EFEA]/80 mt-0.5">
            Cross-platform signals verified. Share with landlord or co-tenants for transparent negotiation.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95"
        >
          {copied ? '✓ Link Copied' : '🔗 Share Audit Link'}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-[#B80D1D] hover:bg-[#B80D1D]/90 text-white shadow-md transition-all active:scale-95"
        >
          📄 Export PDF Report
        </button>
      </div>
    </div>
  );
}