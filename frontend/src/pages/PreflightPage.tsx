import React, { useEffect, useState } from "react";
import { getPreflight } from "@/api/client";
import type { PreflightResult } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/common/Button";

export const PreflightPage: React.FC = () => {
  const [data, setData] = useState<PreflightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPreflight();
      setData(res);
    } catch {
      setError("Failed to fetch preflight status from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Preflight Status</h1>
          <p className="text-sm text-slate-500">Live health check of scrapers, extractors, and backend services</p>
        </div>
        <Button variant="outline" onClick={checkStatus} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Spinner label="Checking system health..." />
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && data && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Overall Status</span>
            <Badge tone={data.all_ok ? "green" : "red"}>
              {data.all_ok ? "All Systems Operational" : "Degraded / Offline"}
            </Badge>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.checks.map((check, idx) => (
              <li key={idx} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{check.name}</p>
                  <p className="text-xs text-slate-500">{check.detail}</p>
                </div>
                <Badge tone={check.ok ? "green" : "red"}>{check.ok ? "OK" : "FAIL"}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};