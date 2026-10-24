import React from "react";
import type { JobEvent } from "../../types/api";
import { Spinner } from "../common/Spinner";
import { Badge } from "../common/Badge";

interface JobStreamFeedProps {
  events: JobEvent[];
  isComplete: boolean;
}

export const JobStreamFeed: React.FC<JobStreamFeedProps> = ({ events, isComplete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-lg">Live Investigation Progress</h3>
        <Badge tone={isComplete ? "green" : "blue"}>
          {isComplete ? "Analysis Complete" : "Investigating..."}
        </Badge>
      </div>

      {!isComplete && (
        <div className="flex items-center space-x-3 py-2 text-sm text-slate-600">
          <Spinner label="Running scrapers, cross-referencing portals, and analyzing cost ladder..." />
        </div>
      )}

      <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
        {events.length === 0 ? (
          <p className="text-slate-400 italic">Initializing stream connection...</p>
        ) : (
          events.map((evt, idx) => (
            <div key={idx} className="flex items-start space-x-2 border-b border-slate-800/60 pb-1">
              <span className="text-slate-500">
                [{new Date((evt as { timestamp?: string }).timestamp || Date.now()).toLocaleTimeString()}]
              </span>
              <span className="text-blue-400 font-semibold">{evt.module || "SYSTEM"}:</span>
              <span className="text-slate-200">{evt.message || evt.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};