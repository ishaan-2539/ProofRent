import React, { useState } from "react";
import { submitDecision } from "../../api/client";

export type DecisionVerdict = "legit" | "suspicious" | "scam";
import { Button } from "../common/Button";

interface DecisionBarProps {
  reportId: string;
  onDecisionSubmitted?: () => void;
}

export const DecisionBar: React.FC<DecisionBarProps> = ({ reportId, onDecisionSubmitted }) => {
  const [verdict, setVerdict] = useState<DecisionVerdict>("suspicious");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitDecision(reportId, { verdict, notes });
      setSubmitted(true);
      if (onDecisionSubmitted) onDecisionSubmitted();
    } catch {
      setError("Failed to record review decision.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-medium">
        Decision recorded: <span className="font-bold uppercase">{verdict}</span>. Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
      <div>
        <h3 className="font-bold text-slate-900 text-lg">Human Review & Decision</h3>
        <p className="text-xs text-slate-500">Record your evaluation of this listing</p>
      </div>

      {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}

      <div className="flex flex-wrap gap-3">
        {(["legit", "suspicious", "scam"] as DecisionVerdict[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVerdict(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize border transition-colors ${
              verdict === v
                ? v === "legit"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : v === "suspicious"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-rose-600 text-white border-rose-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <textarea
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes or reason for this decision..."
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Save Review Decision"}
      </Button>
    </div>
  );
};