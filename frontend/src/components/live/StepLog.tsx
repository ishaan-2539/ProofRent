import { useEffect, useRef } from 'react';
import type { JobEvent } from '../../types/api';

interface StepLogProps {
  events: JobEvent[];
  isComplete?: boolean;
}

export function StepLog({ events, isComplete = false }: StepLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-[#121B13] border border-[#1A261C] rounded-2xl overflow-hidden shadow-luxury flex flex-col h-80">
      {/* Header */}
      <div className="bg-[#1A261C] px-4 py-3 flex items-center justify-between border-b border-[#121B13]">
        <div className="flex items-center gap-2">
          <span className="text-xs">📟</span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FAF8F5]">
            Agent Execution Stream
          </h3>
        </div>
        <span
          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isComplete
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-[#B80D1D]/20 text-[#B80D1D] border border-[#B80D1D]/40'
          }`}
        >
          {isComplete ? 'Complete' : 'Streaming SSE'}
        </span>
      </div>

      {/* Console Feed */}
      <div
        ref={containerRef}
        className="flex-1 p-4 font-mono text-[11px] leading-relaxed space-y-2 overflow-y-auto bg-black/50 text-[#FAF8F5]/90"
      >
        {events.length === 0 ? (
          <div className="text-[#FAF8F5]/40 italic text-center py-10">
            Connecting to proofrent SSE job event bus...
          </div>
        ) : (
          events.map((evt, idx) => {
            const timeStr = new Date(evt.ts || Date.now()).toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            const isError = evt.type === 'failed' || evt.type === 'warning';
            const isModule = evt.type === 'module_ready';

            return (
              <div
                key={idx}
                className={`flex items-start gap-2 border-b border-white/5 pb-1.5 ${
                  isError
                    ? 'text-rose-400'
                    : isModule
                    ? 'text-emerald-300 font-bold'
                    : 'text-[#FAF8F5]/80'
                }`}
              >
                <span className="text-[#FAF8F5]/30 shrink-0">[{timeStr}]</span>
                {evt.portal && (
                  <span className="bg-[#1A261C] px-1.5 py-0.2 rounded text-[9px] text-[#E9DEC3] uppercase font-bold shrink-0">
                    {evt.portal}
                  </span>
                )}
                <span className="flex-1 break-words">{evt.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}