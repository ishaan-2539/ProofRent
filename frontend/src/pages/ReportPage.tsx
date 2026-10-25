import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReportView } from '../components/report/ReportView';
import { getReport, ApiClientError } from '../api/client';
import type { Report } from '../types/api';

interface LoadError {
  message: string;
  nextStep: string | null;
}

const POLL_MS = 2500;

function toLoadError(err: unknown): LoadError {
  if (err instanceof ApiClientError) {
    return { message: err.error.message, nextStep: err.error.next_step };
  }
  // fetch() itself failed: backend down, wrong VITE_API_BASE_URL, CORS, offline...
  return {
    message: 'Could not reach the ProofRent server.',
    nextStep: 'Check your connection and try again in a moment.',
  };
}

export function ReportPage() {
  const { report_id } = useParams<{ report_id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<LoadError | null>(null);

  // Ignore responses that arrive after the route changed or the page unmounted.
  const requestSeq = useRef(0);

  const fetchReport = useCallback(
    async (silent = false) => {
      if (!report_id) {
        setError({ message: 'No report id in the link.', nextStep: 'Start a new investigation from the home page.' });
        setLoading(false);
        return;
      }

      const seq = ++requestSeq.current;
      if (!silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await getReport(report_id);
        if (seq !== requestSeq.current) return;
        setReport(data);
        setError(null);
      } catch (err) {
        if (seq !== requestSeq.current) return;
        // On a silent refresh keep showing the last good report instead of blanking the page.
        if (!silent) {
          setReport(null);
          setError(toLoadError(err));
        } else {
          console.warn('Background refresh failed:', err);
        }
      } finally {
        if (seq === requestSeq.current && !silent) setLoading(false);
      }
    },
    [report_id]
  );

  // Initial load (and reload when the id changes).
  useEffect(() => {
    setReport(null);
    fetchReport(false);
    return () => {
      requestSeq.current++; // invalidate in-flight requests
    };
  }, [fetchReport]);

  // While the investigation is still running, keep refreshing quietly.
  const inProgress = report?.status === 'queued' || report?.status === 'running';
  useEffect(() => {
    if (!inProgress) return;
    const t = window.setInterval(() => fetchReport(true), POLL_MS);
    return () => window.clearInterval(t);
  }, [inProgress, fetchReport]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#F4EFEA] border-t-[#B80D1D] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A261C]">Loading ProofRent report...</p>
        <p className="text-xs text-[#1A261C]/60 mt-1">Fetching the saved investigation</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-[#B80D1D]/10 text-[#B80D1D] p-5 rounded-2xl border border-[#B80D1D]/20 max-w-md shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider">Report could not be loaded</h2>
          <p className="text-xs mt-1.5">{error?.message ?? 'No report data available.'}</p>
          {error?.nextStep && <p className="text-xs mt-1 opacity-80">{error.nextStep}</p>}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fetchReport(false)}
            className="text-xs font-bold text-[#B80D1D] hover:underline"
          >
            ↻ Try again
          </button>
          <Link to="/" className="text-xs font-bold text-[#1A261C] hover:underline">
            ← Return to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] p-4 sm:p-6 lg:p-8">
      {/* Top Navigation & Report Header */}
      <header className="max-w-5xl mx-auto mb-8 flex items-center justify-between border-b border-[#F4EFEA] pb-5">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] bg-white border border-[#F4EFEA] px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>←</span> Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50">
                Report:
              </span>
              <span className="text-[11px] font-mono font-bold text-[#B80D1D] bg-[#B80D1D]/5 border border-[#B80D1D]/20 px-2 py-0.5 rounded-md">
                {report.report_id}
              </span>
              {inProgress && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50">
                  · updating…
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-[#1A261C] tracking-tight mt-0.5">
              Listing Investigation Report
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchReport(true)}
          className="text-xs font-bold text-[#B80D1D] bg-[#B80D1D]/10 hover:bg-[#B80D1D]/20 border border-[#B80D1D]/20 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
        >
          <span>↻</span> Refresh
        </button>
      </header>

      <main>
        <ReportView report={report} onRefetch={() => fetchReport(true)} />
      </main>
    </div>
  );
}