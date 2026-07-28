import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router";
import { Search, LayoutDashboard, ShieldAlert, Upload, Settings, Activity } from "lucide-react";
import "./command-palette.css"; // We'll add styles here

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="cmdk-dialog"
    >
      <div className="cmdk-overlay" onClick={() => setOpen(false)} />
      
      <div className="cmdk-content">
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-5 h-5 text-muted mr-3" />
          <Command.Input 
            placeholder="Search incidents, logs, IPs or commands..." 
            className="w-full bg-transparent border-none py-4 text-text focus:outline-none focus:ring-0 placeholder-muted"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted">
            No results found.
          </Command.Empty>

          <Command.Group heading="Quick Actions">
            <Command.Item onSelect={() => runCommand(() => navigate("/upload"))} className="cmdk-item">
              <Upload className="w-4 h-4 mr-2" /> Upload Logs
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate("/investigations/new"))} className="cmdk-item">
              <ShieldAlert className="w-4 h-4 mr-2" /> New Investigation
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Navigation">
            <Command.Item onSelect={() => runCommand(() => navigate("/dashboard"))} className="cmdk-item">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Open Dashboard
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate("/ai-workspace"))} className="cmdk-item">
              <Activity className="w-4 h-4 mr-2" /> Open AI Workspace
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate("/settings"))} className="cmdk-item">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
