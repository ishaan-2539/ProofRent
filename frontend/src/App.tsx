import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';
import { InvestigatePage } from './pages/InvestigatePage';
import { PreflightPage } from './pages/PreflightPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page with hero url input */}
        <Route path="/" element={<HomePage />} />

        {/* Live investigation stream workspace */}
        <Route path="/investigate/:report_id" element={<InvestigatePage />} />

        {/* Verification audit report view */}
        <Route path="/report/:report_id" element={<ReportPage />} />

        {/* System status preflight dashboard */}
        <Route path="/preflight" element={<PreflightPage />} />

        {/* Fallbacks */}
        <Route path="/report" element={<Navigate to="/report/demo" replace />} />
        <Route path="/investigate" element={<Navigate to="/investigate/demo" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}