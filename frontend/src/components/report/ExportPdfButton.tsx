import React, { useState } from "react";
import { exportPdf } from "../../api/client";
import { Button } from "../common/Button";

interface ExportPdfButtonProps {
  reportId: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ reportId }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proofrent-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Failed to export PDF report.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={exporting}>
      {exporting ? "Generating PDF..." : "Download PDF Report"}
    </Button>
  );
};