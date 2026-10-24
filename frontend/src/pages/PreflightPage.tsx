import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPreflight } from "@/api/client";
import type { PreflightResult } from "@/types/api";

export function PreflightPage() {
  const [result, setResult] = useState<PreflightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPreflight = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPreflight();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to backend preflight runner.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreflight();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#1A261C] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#F4EFEA] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] border border-[#F4EFEA] px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            ← Home
          </Link>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">System Preflight Status</h1>
            <p className="text-[10px] font-mono text-[#1A261C]/60">Verification Engine & Service Diagnostics</p>
          </div>
        </div>

        <button
          onClick={loadPreflight}
          disabled={loading}
          className="text-xs font-bold bg-[#1A261C] text-white px-3.5 py-1.5 rounded-xl hover:bg-[#1A261C]/90 transition-all disabled:opacity-50"
        >
          {loading ? "Re-checking..." : "🔄 Re-run Preflight"}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-white border border-[#F4EFEA] rounded-2xl shadow-sm">
            <div className="w-10 h-10 border-4 border-[#F4EFEA] border-t-[#B80D1D] rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono font-bold text-[#1A261C]">Executing Preflight Health Checks...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase">Preflight Connection Failed</h3>
            <p className="text-xs">{error}</p>
            <p className="text-[11px] text-rose-700/80">Ensure backend server is running on port 8000.</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Overall Status Banner */}
            <div
              className={`p-6 rounded-2xl border shadow-card flex items-center justify-between ${
                result.all_ok
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">
                  Overall System Health
                </span>
                <h2 className="text-lg font-extrabold">
                  {result.all_ok ? "All Preflight Checks Passed (Ready for Demo)" : "System Operating with Warnings"}
                </h2>
              </div>
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-lg ${
                  result.all_ok ? "bg-emerald-200 text-emerald-900" : "bg-amber-200 text-amber-900"
                }`}
              >
                {result.all_ok ? "● SYSTEM READY" : "⚠️ NEEDS ATTENTION"}
              </span>
            </div>

            {/* Individual Checks List */}
            <div className="bg-white border border-[#F4EFEA] rounded-2xl overflow-hidden shadow-card divide-y divide-[#F4EFEA]">
              {result.checks.map((check, idx) => (
                <div key={idx} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#1A261C]">{check.name}</span>
                    </div>
                    <p className="text-xs text-[#1A261C]/70">{check.detail}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shrink-0 ${
                      check.ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {check.ok ? "PASS" : "FAIL"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}