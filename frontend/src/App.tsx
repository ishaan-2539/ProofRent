import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page with hero input */}
        <Route path="/" element={<HomePage />} />

        {/* Route for verification reports */}
        <Route path="/report/:report_id" element={<ReportPage />} />

        {/* Fallbacks */}
        <Route path="/report" element={<Navigate to="/report/demo" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}