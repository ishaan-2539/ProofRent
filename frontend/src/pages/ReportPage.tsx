import React from "react";
import { useParams } from "react-router-dom";
import { useInvestigationStream } from "@/hooks/useInvestigationStream";
import { Spinner } from "@/components/common/Spinner";

export const ReportPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { report, loading, error } = useInvestigationStream(reportId);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner label="Loading investigation report..." />
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
        <h3 className="font-bold text-lg">Unable to load report</h3>
        <p className="text-sm mt-1">{error || "Report not found."}</p>
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
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">
          Investigation: {report.listing?.title.value || report.input_url}
        </h1>
        <p className="text-sm text-slate-500">Report ID: {report.report_id}</p>
      </div>
    </div>
  );
}