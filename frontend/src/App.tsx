import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import CEODashboard from "./pages/CEODashboard";
import Investigations from "./pages/Investigations";
import InvestigationWorkspace from "./pages/InvestigationWorkspace";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import AIWorkspace from "./pages/AIWorkspace";
import UploadCenter from "./pages/UploadCenter";

import { Shield } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 bg-background text-text">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Shield className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-bold text-text">Obsidian SOC</h1>
        </div>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Stop Reading Logs. Start Understanding Threats.
        </p>
      </div>
      <div className="flex gap-4">
         <a href="/dashboard" className="btn-primary">Launch Workspace</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Workspace Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ceo-dashboard" element={<CEODashboard />} />
          <Route path="/investigations" element={<Investigations />} />
          <Route path="/investigations/:id" element={<InvestigationWorkspace />} />
          <Route path="/threat-intel" element={<ThreatIntelligence />} />
          <Route path="/ai-workspace" element={<AIWorkspace />} />
          <Route path="/upload" element={<UploadCenter />} />
          
          <Route path="/analytics" element={<div className="p-6">Analytics Coming Soon</div>} />
          <Route path="/reports" element={<div className="p-6">Reports Coming Soon</div>} />
          <Route path="/knowledge" element={<div className="p-6">Knowledge Base Coming Soon</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
