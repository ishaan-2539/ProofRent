import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInvestigationStream } from '../hooks/useInvestigationStream';
import { LiveBrowserGrid, type ActiveTile } from '../components/live/LiveBrowserGrid';
import { StepLog } from '../components/live/StepLog';
import { ProgressBar } from '../components/live/ProgressBar';
import { ReportView } from '../components/report/ReportView';

export function InvestigatePage() {
  const { report_id } = useParams<{ report_id: string }>();
  const navigate = useNavigate();

  const activeId = report_id || 'demo';
  const { report, events, loading, error } = useInvestigationStream(activeId);

  const [tiles, setTiles] = useState<ActiveTile[]>([]);

  // Update active stream tiles based on SSE job events
  useEffect(() => {
    if (!events || events.length === 0) return;

    const latestEvent = events[events.length - 1];

    if (latestEvent.portal || latestEvent.stream_url || latestEvent.screenshot_url) {
      setTiles((prev) => {
        const portalKey = latestEvent.portal || 'tinyfish_agent';
        const existingIdx = prev.findIndex((t) => t.portal === portalKey);

        const newTile: ActiveTile = {
          portal: portalKey,
          streamUrl: latestEvent.stream_url || (existingIdx >= 0 ? prev[existingIdx].streamUrl : null),
          screenshotUrl: latestEvent.screenshot_url || (existingIdx >= 0 ? prev[existingIdx].screenshotUrl : null),
          statusText: latestEvent.message,
          finished: latestEvent.type === 'module_ready' || latestEvent.type === 'completed',
        };

        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newTile;
          return updated;
        }

        return [...prev, newTile];
      });
    }
  }, [events]);

  const isCompleted = report?.status === 'completed' || report?.status === 'failed';
  const modules = report?.modules || [];

  return (
    <div className="min-h-screen bg-[#FAFAFC] p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Bar Header */}
      <header className="flex items-center justify-between border-b border-[#F4EFEA] pb-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-bold text-[#1A261C] bg-white border border-[#F4EFEA] hover:bg-[#F4EFEA] px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            ← Search New
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
                Real-Time AI Investigation
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#1A261C] text-white px-2 py-0.5 rounded-md">
                ID: {activeId}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#1A261C] font-display tracking-tight mt-0.5">
              ProofRent Multi-Portal Audit Stream
            </h1>
          </div>
        </div>

        {isCompleted && (
          <Link
            to={`/report/${activeId}`}
            className="text-xs font-bold text-white bg-[#B80D1D] hover:bg-[#8B0000] px-4 py-2.5 rounded-xl shadow-red-glow transition-all"
          >
            View Full Report Only ↗
          </Link>
        )}
      </header>

      {/* Pipeline Module Progress */}
      <ProgressBar modules={modules} />

      {/* Live Workspace Grid: Agent Browser & SSE Step Log */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A261C]/60">
            Active Browser Frames (Max 2 Parallel)
          </h3>
          <LiveBrowserGrid tiles={tiles} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A261C]/60">
            Event Bus Terminal
          </h3>
          <StepLog events={events} isComplete={isCompleted} />
        </div>
      </section>

      {/* Progressive Report Reveal */}
      {report && (
        <section className="pt-6 border-t border-[#F4EFEA] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-extrabold text-[#1A261C]">
              Generated Audit Output
            </h2>
            <span className="text-xs font-mono text-[#1A261C]/50">
              {loading ? 'Fulfilling stream modules...' : 'Analysis synchronized'}
            </span>
          </div>

          <ReportView report={report} />
        </section>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold text-center">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}