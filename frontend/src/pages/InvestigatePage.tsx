import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useInvestigationStream } from '../hooks/useInvestigationStream';
import { ReportView } from '../components/report/ReportView';
import { ProgressBar } from '../components/live/ProgressBar';
import { StepLog } from '../components/live/StepLog';
import { LiveBrowserGrid, type BrowserTileData } from '../components/live/LiveBrowserGrid';

const POLL_MS = 3000;

const val = (v: any) => (v && typeof v === 'object' && 'value' in v ? v.value : v);

export function InvestigatePage() {
  const { report_id } = useParams<{ report_id: string }>();
  const activeReportId = report_id || 'demo';

  const { report, events, loading, error, refetch } = useInvestigationStream(activeReportId);

  // The backend fills the report in module by module. Until it is finished, the report
  // is only partly populated, so we show live progress instead of empty report blocks
  // (those looked like a broken page even though the work was happening).
  const status = report?.status;
  const isRunning = !!report && (status === 'queued' || status === 'running');

  // Safety net: if the live stream drops, keep refreshing so the page never gets stuck.
  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      refetch();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [isRunning, refetch]);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!isRunning) return;
    setElapsed(0);
    const timer = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  // Live agent browsers (only when the backend actually sends a stream or screenshot).
  const tiles = useMemo<BrowserTileData[]>(() => {
    const map = new Map<string, BrowserTileData>();
    events.forEach((e) => {
      if (e.type !== 'stream_url' || !(e.stream_url || e.screenshot_url)) return;
      const key = e.portal ?? 'primary';
      const prev = map.get(key);
      map.set(key, {
        id: key,
        portal: e.portal,
        streamUrl: e.stream_url ?? prev?.streamUrl ?? null,
        lastScreenshotUrl: e.screenshot_url ?? prev?.lastScreenshotUrl ?? null,
        finished: false,
        title: e.message,
      });
    });
    return Array.from(map.values());
  }, [events]);

  const latestStep = useMemo(
    () => [...events].reverse().find((e) => e.type === 'step' || e.type === 'started'),
    [events]
  );
  const failedEvent = useMemo(() => [...events].reverse().find((e) => e.type === 'failed'), [events]);

  // ------------------------------------------------------------ first load
  if (loading && !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#F4EFEA] border-t-[#1A261C] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A261C]">Connecting to the investigation...</p>
        <p className="text-xs text-[#1A261C]/60 mt-1">Opening the live progress stream</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 gap-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-xs font-semibold">
          Error connecting to investigation stream: {error}
        </div>
        <Link to="/" className="text-xs font-bold text-[#1A261C] hover:underline">
          ← Return to Search
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] p-6">
        <div className="max-w-4xl mx-auto p-8 text-center text-xs text-[#1A261C]/60 bg-[#FAFAFC] rounded-2xl border border-[#F4EFEA]">
          No report data available for ID: {activeReportId}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ investigation in progress
  if (isRunning) {
    const listing: any = report.listing;
    const title = val(listing?.title) || val(listing?.operator_name);
    const place = val(listing?.address_text) || val(listing?.locality);
    const firstRent = listing?.rent_options?.find((o: any) => o.monthly_rent)?.monthly_rent;

    return (
      <div className="min-h-screen bg-[#FAFAFC] p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
                Investigation in progress
              </span>
              <h1 className="text-xl font-extrabold text-[#1A261C] tracking-tight mt-0.5">
                {title ? `Checking: ${title}` : 'Reading your listing...'}
              </h1>
              <p className="text-xs text-[#1A261C]/60 mt-1 break-all">{report.input_url}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-2xl font-mono font-bold text-[#1A261C]">{elapsed}s</div>
              <div className="text-[10px] text-[#1A261C]/50">usually 30 to 90 seconds</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#F4EFEA] rounded-2xl px-5 py-4 shadow-card">
            <div className="w-5 h-5 border-2 border-[#F4EFEA] border-t-[#B80D1D] rounded-full animate-spin shrink-0" />
            <p className="text-sm font-semibold text-[#1A261C]">
              {latestStep?.message || 'Starting the investigation...'}
            </p>
          </div>

          <ProgressBar modules={report.modules} />

          {title && (
            <div className="bg-white border border-[#F4EFEA] rounded-2xl p-5 shadow-card">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50">
                Listing read successfully
              </span>
              <h2 className="text-base font-bold text-[#1A261C] mt-1">{title}</h2>
              {place && <p className="text-xs text-[#1A261C]/60 mt-0.5">📍 {place}</p>}
              {firstRent && (
                <p className="text-sm font-bold text-[#1A261C] mt-2">
                  From ₹{Number(firstRent).toLocaleString('en-IN')} / month
                </p>
              )}
              <p className="text-xs text-[#1A261C]/50 mt-2">
                Now searching other portals for the same place and building the cost breakdown.
              </p>
            </div>
          )}

          {tiles.length > 0 && <LiveBrowserGrid tiles={tiles} />}

          <StepLog events={events} isComplete={false} />
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ finished (completed / partial / failed)
  return (
    <div className="min-h-screen bg-[#FAFAFC] p-6 space-y-6">
      {status === 'failed' && (
        <div className="max-w-5xl mx-auto bg-amber-50 border border-amber-200 text-amber-900 px-5 py-4 rounded-2xl text-xs font-semibold">
          {failedEvent?.message || 'This investigation could not be completed.'} Parts that could not be checked are shown as unknown.
        </div>
      )}
      {status === 'partial' && (
        <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-2xl text-xs font-semibold">
          Some parts could not be completed. Anything we could not check is shown as unknown, nothing is guessed.
        </div>
      )}

      <ReportView report={report} onRefetch={refetch} />

      {events.length > 0 && !report.is_replay && (
        <details className="max-w-5xl mx-auto">
          <summary className="cursor-pointer text-xs font-bold text-[#1A261C]/70 hover:text-[#1A261C]">
            Show investigation log ({events.length} events)
          </summary>
          <div className="mt-3">
            <StepLog events={events} isComplete />
          </div>
        </details>
      )}
    </div>
  );
}