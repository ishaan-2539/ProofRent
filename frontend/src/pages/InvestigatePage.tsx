import { useParams, Link } from "react-router-dom";
import { useInvestigationStream } from "@/hooks/useInvestigationStream";
import { ReplayBanner } from "@/components/live/ReplayBanner";
import { ProgressBar } from "@/components/live/ProgressBar";
import { StepLog } from "@/components/live/StepLog";
import { LiveBrowserGrid, type BrowserTileData } from "@/components/live/LiveBrowserGrid";
import { ReportView } from "@/components/report/ReportView";
import type { PortalId } from "@/types/api";

export function InvestigatePage() {
  const { report_id } = useParams<{ report_id: string }>();
  const { report, events, loading, error, setReport } = useInvestigationStream(report_id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#F4EFEA] border-t-[#B80D1D] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A261C]">Initializing Investigation Stream...</p>
        <p className="text-xs text-[#1A261C]/60 mt-1">Establishing SSE channel to ProofRent backend</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-[#B80D1D]/10 text-[#B80D1D] p-5 rounded-2xl border border-[#B80D1D]/20 max-w-md shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider">Stream Connection Failure</h2>
          <p className="text-xs mt-1.5">{error || "Report context not found."}</p>
        </div>
        <Link to="/" className="text-xs font-bold text-[#1A261C] hover:underline">
          ← Return to Search
        </Link>
      </div>
    );
  }

  const isComplete = report.status === "completed" || report.status === "failed";

  const streamEvents = events.filter((e) => e.stream_url || e.screenshot_url);
  const tiles: BrowserTileData[] = streamEvents.length > 0
    ? streamEvents.slice(-2).map((evt, idx) => ({
        id: `tile-${idx}-${evt.portal || "agent"}`,
        portal: evt.portal as PortalId | null,
        streamUrl: evt.stream_url,
        lastScreenshotUrl: evt.screenshot_url,
        finished: isComplete,
        title: evt.message,
      }))
    : [
        {
          id: "primary-agent",
          portal: report.portal || null,
          streamUrl: null,
          lastScreenshotUrl: null,
          finished: isComplete,
          title: report.input_url,
        },
      ];

  const handleRefetch = async () => {
    setReport({ ...report });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      {report.is_replay && <ReplayBanner label={report.replay_label} />}

      <header className="bg-white border-b border-[#F4EFEA] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] border border-[#F4EFEA] px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            ← Home
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50">
                Live Run ID:
              </span>
              <span className="text-[11px] font-mono font-bold text-[#B80D1D] bg-[#B80D1D]/5 border border-[#B80D1D]/20 px-2 py-0.5 rounded-md">
                {report_id}
              </span>
            </div>
            <h1 className="text-base font-extrabold text-[#1A261C] tracking-tight">
              Active Rental Investigation Session
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isComplete ? "bg-emerald-500" : "bg-amber-500 animate-ping"}`} />
          <span className="text-xs font-mono font-bold text-[#1A261C] uppercase">
            {report.status}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <ProgressBar modules={report.modules} />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]/80">
              Live Agent Execution & Streaming Console
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveBrowserGrid tiles={tiles} />
            <StepLog events={events} isComplete={isComplete} />
          </div>
        </section>

        <section className="pt-4 border-t border-[#F4EFEA]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]">
              Verified Report Findings
            </h2>
            <span className="text-xs font-mono text-[#1A261C]/60">
              {isComplete ? "Final Report Compiled" : "Updating as modules finish..."}
            </span>
          </div>

          <ReportView report={report} onRefetch={handleRefetch} />
        </section>
      </main>
    </div>
  );
}