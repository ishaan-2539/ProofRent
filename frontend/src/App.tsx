import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReportPage } from './pages/ReportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for verification reports */}
        <Route path="/report/:report_id" element={<ReportPage />} />

        {/* Fallback route for /report or unknown paths -> redirect to demo report */}
        <Route path="/report" element={<Navigate to="/report/demo" replace />} />
        <Route path="*" element={<Navigate to="/report/demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}