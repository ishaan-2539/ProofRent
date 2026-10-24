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
    <div className="bg-[#1A261C] text-white rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-md">
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4EFEA]">
          Verified ProofRent Report
        </h4>
        <p className="text-xs text-[#F4EFEA]/70">
          Share this audit report with co-tenants or landlord for negotiation.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#F4EFEA] text-[#1A261C] hover:bg-white transition-colors"
        >
          {copied ? '✓ Link Copied' : 'Share Link'}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#B80D1D] text-white hover:bg-[#B80D1D]/90 transition-colors"
        >
          Export / Print PDF
        </button>
      </div>
    </div>
  );
}