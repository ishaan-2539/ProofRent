import React, { useRef, useEffect } from "react";
import type { JobEvent } from "@/types/api";

interface StepLogProps {
  events: JobEvent[];
  isComplete?: boolean;
}

export const StepLog: React.FC<StepLogProps> = ({ events, isComplete = false }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-[#121B13] border border-[#1A261C] rounded-2xl overflow-hidden shadow-luxury flex flex-col h-80">
      <div className="px-4 py-3 bg-[#1A261C] border-b border-[#FAF8F5]/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D] animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FAF8F5]">
            Telemetry Event Stream
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#FAF8F5]/60 bg-black/40 px-2 py-0.5 rounded">
          {events.length} Events Logged
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs text-[#FAF8F5]/90 overflow-y-auto space-y-2 select-text"
      >
        {events.length === 0 ? (
          <div className="text-[#FAF8F5]/40 italic text-center py-12">
            Initializing SSE stream connection to backend orchestrator...
          </div>
        ) : (
          events.map((evt, idx) => {
            const timeStr = evt.ts ? new Date(evt.ts).toLocaleTimeString() : "--:--:--";
            let typeColor = "text-[#FAF8F5]/60";

            if (evt.type === "started") typeColor = "text-cyan-400 font-bold";
            if (evt.type === "module_ready") typeColor = "text-emerald-400 font-bold";
            if (evt.type === "stream_url") typeColor = "text-amber-300 font-bold";
            if (evt.type === "warning") typeColor = "text-amber-400";
            if (evt.type === "failed") typeColor = "text-rose-400 font-bold";
            if (evt.type === "completed") typeColor = "text-emerald-300 font-bold";

            return (
              <div key={idx} className="flex items-start gap-2 leading-relaxed border-b border-white/5 pb-1">
                <span className="text-[#FAF8F5]/40 shrink-0">[{timeStr}]</span>
                {evt.module && (
                  <span className="text-[#B80D1D] font-bold uppercase shrink-0">
                    [{evt.module}]
                  </span>
                )}
                {evt.portal && (
                  <span className="text-blue-300 uppercase shrink-0">
                    [{evt.portal}]
                  </span>
                )}
                <span className={`shrink-0 ${typeColor}`}>[{evt.type}]</span>
                <span className="text-[#FAF8F5]/90 break-words">{evt.message}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-2 bg-[#1A261C]/50 border-t border-[#FAF8F5]/10 text-[11px] font-mono text-[#FAF8F5]/60 flex justify-between items-center shrink-0">
        <span>ProofRent Telemetry Bus v1.0</span>
        <span>{isComplete ? "✓ Stream Ended" : "● Live Connection"}</span>
      </div>
    </div>
  );
};