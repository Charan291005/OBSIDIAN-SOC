import { Bell, Search, User, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function TopNav() {
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    const health = await api.checkHealth();
    setIsLive(health.isLive);
    setChecking(false);
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const triggerCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
      
      {/* Command Palette Trigger */}
      <div className="flex-1 max-w-xl">
        <button 
          onClick={triggerCommandPalette}
          className="flex items-center gap-2 w-full max-w-md bg-surface border border-border rounded-lg px-4 py-2 text-sm text-muted hover:border-primary/50 transition-colors focus:outline-none"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search incidents, logs, IPs...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-medium text-muted bg-card px-1.5 py-0.5 rounded border border-border">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Backend Connection Status Badge */}
        <button
          onClick={checkConnection}
          title="Click to re-check backend connection status"
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-surface hover:bg-card transition-colors cursor-pointer"
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-warning'}`} />
          <span className="text-muted">
            {checking ? "Checking..." : isLive ? "API Online" : "Demo Mode (Warming Up)"}
          </span>
          <RefreshCw className={`w-3 h-3 text-muted ${checking ? 'animate-spin' : ''}`} />
        </button>

        <button className="relative p-2 text-muted hover:text-text transition-colors rounded-full hover:bg-surface">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full border border-background"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors">
          <User className="w-4 h-4 text-muted" />
        </div>
      </div>
      
    </header>
  );
}

