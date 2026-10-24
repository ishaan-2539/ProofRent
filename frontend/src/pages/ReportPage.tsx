
import { useParams } from 'react-router-dom';

export function ReportPage() {
  const { report_id } = useParams<{ report_id: string }>();
  return <div className="p-4">Report Page for {report_id}</div>;
}