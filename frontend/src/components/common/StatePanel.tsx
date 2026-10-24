import React from "react";
import { ModuleStatus } from "@/types/api";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

interface StatePanelProps {
  kind: ModuleStatus;
  title: string;
  message?: string | null;
  nextStep?: string | null;
  onRetry?: () => void;
}

export const StatePanel: React.FC<StatePanelProps> = ({ kind, title, message, nextStep, onRetry }) => {
  if (kind === "working" || kind === "pending") {
    return (
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
        <Spinner />
        <h4 className="font-semibold text-slate-800">{title}</h4>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    );
  }

  const bgMap: Record<string, string> = {
    failed: "bg-rose-50 border-rose-200",
    partial: "bg-amber-50 border-amber-200",
    empty: "bg-slate-50 border-slate-200",
    not_checked: "bg-slate-50 border-slate-200",
  };

  return (
    <div className={`p-6 rounded-xl border ${bgMap[kind] || "bg-slate-50 border-slate-200"} space-y-3`}>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      {nextStep && <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{nextStep}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};