import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { CommandPalette } from "../ui/CommandPalette";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation / Command Palette trigger */}
        <TopNav />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
