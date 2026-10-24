import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { HomePage } from "./pages/HomePage";
import { PreflightPage } from "./pages/PreflightPage";
import { ReportPage } from "./pages/ReportPage";

const Layout: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/preflight" element={<PreflightPage />} />
          <Route path="/investigate/:reportId" element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;