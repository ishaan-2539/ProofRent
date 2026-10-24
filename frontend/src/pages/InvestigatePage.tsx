import { useParams } from 'react-router-dom';
import { useInvestigationStream } from '../hooks/useInvestigationStream';
import { ReportView } from '../components/report/ReportView';

export function InvestigatePage() {
  const { report_id } = useParams<{ report_id: string }>();
  const activeReportId = report_id || 'demo';

  const { report, loading, error } = useInvestigationStream(activeReportId);

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#F4EFEA] border-t-[#1A261C] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A261C]">Initializing Investigation Pipeline...</p>
        <p className="text-xs text-[#1A261C]/60 mt-1">Establishing SSE live stream connection</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-xs font-semibold">
          Error connecting to investigation stream: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] p-6 space-y-6">
      {report ? (
        <ReportView report={report} />
      ) : (
        <div className="max-w-4xl mx-auto p-8 text-center text-xs text-[#1A261C]/60 bg-[#FAFAFC] rounded-2xl border border-[#F4EFEA]">
          No report data available for ID: {activeReportId}
        </div>
      )}
    </div>
  );
}