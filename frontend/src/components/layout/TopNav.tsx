import { Bell, Search, User } from "lucide-react";

export default function TopNav() {
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
