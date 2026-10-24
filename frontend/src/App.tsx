import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/common/AppShell';
import { HomePage } from './pages/HomePage';
import { InvestigatePage } from './pages/InvestigatePage';
import { ReportPage } from './pages/ReportPage';
import { PreflightPage } from './pages/PreflightPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/preflight" element={<PreflightPage />} />
          <Route path="/investigate/:report_id" element={<InvestigatePage />} />
          <Route path="/report/:report_id" element={<ReportPage />} />

          <Route path="/investigate" element={<Navigate to="/investigate/demo" replace />} />
          <Route path="/report" element={<Navigate to="/report/demo" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}