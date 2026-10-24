import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInvestigation, getExamples, ApiClientError } from "@/api/client";
import type { ExampleListing } from "../types/api";
import { ListingInput } from "@/components/home/ListingInput";
import { ExampleButtons } from "@/components/home/ExampleButtons";
import { SupportedPortals } from "@/components/home/SupportedPortals";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [examples, setExamples] = useState<ExampleListing[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    getExamples()
      .then(setExamples)
      .catch(() => {
        // Fallback placeholder examples if backend offline
        setExamples([
          { example_id: "match", title: "Same Place, Two Prices", description: "Aggarwal PG Govindpuri", url: "", portal: "magicbricks" },
          { example_id: "no_match", title: "No Match Found", description: "Standalone flat in Saket", url: "", portal: "nobroker" },
          { example_id: "hidden_fees", title: "Hidden Fees Discovered", description: "Mathur PG Laxmi Nagar", url: "", portal: "gopgo" },
          { example_id: "blocked", title: "Blocked Portal Replay", description: "99acres listing check", url: "", portal: "ninetynineacres" },
        ]);
      });
  }, []);

  const handleStartUrl = async (url: string) => {
    setBusy(true);
    setApiError(null);
    try {
      const res = await startInvestigation({
  url: url.trim(),
  replay_example_id: null,
  force_refresh: false,
});
      navigate(`/investigate/${res.report_id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setApiError(err.error.message);
      } else {
        setApiError("Failed to start investigation. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handlePickExample = async (example: ExampleListing) => {
    setBusy(true);
    setApiError(null);
    try {
      const res = await startInvestigation({
  url: null,
  replay_example_id: example.example_id,
  force_refresh: false,
});
      navigate(`/investigate/${res.report_id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setApiError(err.error.message);
      } else {
        setApiError("Failed to load example. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-3 max-w-xl">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">ProofRent</h1>
        <p className="text-lg font-medium text-slate-600">Know before you sign.</p>
        <p className="text-sm text-slate-500">
          Investigate any rental or PG listing in Delhi NCR for price differences and hidden costs.
        </p>
      </div>

      <ListingInput onSubmit={handleStartUrl} busy={busy} />

      {apiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium max-w-2xl w-full">
          {apiError}
        </div>
      )}

      <div className="max-w-2xl w-full">
        <ExampleButtons examples={examples} onPick={handlePickExample} />
      </div>

      <SupportedPortals />
    </div>
  );
};