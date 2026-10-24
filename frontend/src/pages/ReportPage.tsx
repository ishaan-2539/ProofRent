import React from "react";
import { useParams, Link } from "react-router-dom";
import { useInvestigationStream } from "../hooks/useInvestigationStream";
import { Spinner } from "../components/common/Spinner";
import { JobStreamFeed } from "../components/report/JobStreamFeed";
import { DecisionBar } from "../components/report/DecisionBar";
import { ExportPdfButton } from "../components/report/ExportPdfButton";
import { formatCurrencyINR, formatTimestampIST } from "../lib/format";
import { getEvidenceLabelText } from "../lib/labels";

export const ReportPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { report, events, loading, error } = useInvestigationStream(reportId);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner label="Connecting to live investigation stream..." />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 space-y-4">
        <h3 className="font-bold text-lg">Unable to load report</h3>
        <p className="text-sm">{error || "Report not found."}</p>
        <Link to="/" className="inline-block text-xs font-semibold text-rose-800 underline">
          &larr; Return to Home
        </Link>
      </div>
    );
  }

  const isComplete = report.status === "completed" || report.status === "failed";
  
  // Safe field extractions to handle type schema variations cleanly
  const listingAny = report.listing as any;
  const rentPrice = listingAny?.rent_price?.value ?? listingAny?.price?.value ?? listingAny?.rent?.value;
  const rawTimestamp = (report as any).created_at || (report as any).captured_at || (report as any).timestamp;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header & Meta */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Report #{report.report_id}</span>
            <span>•</span>
            <span>Captured {formatTimestampIST(rawTimestamp)}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {listingAny?.title?.value || report.input_url}
          </h1>
          {rentPrice !== undefined && rentPrice !== null && (
            <p className="text-lg font-semibold text-blue-600 mt-1">
              {formatCurrencyINR(Number(rentPrice))} / month
            </p>
          )}
        </div>

        {isComplete && <ExportPdfButton reportId={report.report_id} />}
      </div>

      {/* Live Stream Feed */}
      <JobStreamFeed events={events} isComplete={isComplete} />

      {/* Findings Overview */}
      {report.findings && report.findings.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg">Key Risk Findings ({report.findings.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.findings.map((f, idx) => {
              const findingAny = f as any;
              const detailText = findingAny.detail || findingAny.description || findingAny.summary || findingAny.message || "";
              return (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {getEvidenceLabelText(findingAny.label)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 capitalize">{findingAny.confidence} confidence</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{detailText}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Human Review Section */}
      {isComplete && <DecisionBar reportId={report.report_id} />}
    </div>
  );
};