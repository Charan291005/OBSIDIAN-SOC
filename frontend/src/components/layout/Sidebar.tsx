import { Link, useLocation, useNavigate, NavLink } from "react-router";
import { useState, useEffect } from "react";
import { 
  Shield, 
  LayoutDashboard, 
  Briefcase, 
  AlertTriangle, 
  Activity, 
  UserCircle,
  Settings, 
  Upload
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Investigations", href: "/investigations" },
  { icon: AlertTriangle, label: "Threat Intel", href: "/threat-intel" },
  { icon: Activity, label: "AI Workspace", href: "/ai-workspace" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCeoMode, setIsCeoMode] = useState(false);
  
  // Keep toggle in sync with current route on load
  useEffect(() => {
    if (location.pathname === "/ceo-dashboard") setIsCeoMode(true);
    else if (location.pathname === "/dashboard") setIsCeoMode(false);
  }, [location.pathname]);

  const togglePersona = () => {
    if (isCeoMode) {
      setIsCeoMode(false);
      navigate("/dashboard");
    } else {
      setIsCeoMode(true);
      navigate("/ceo-dashboard");
    }
  };

  return (
    <div className="w-64 border-r border-border bg-background flex flex-col shrink-0 h-full">
      
      {/* Brand & Persona Toggle */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl font-heading tracking-tight">Obsidian</span>
        </div>
        
        <button 
          onClick={togglePersona}
          className="w-full flex items-center justify-between p-2 rounded-lg border border-border bg-surface hover:bg-card transition-colors group"
        >
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary" />
            <div className="text-left">
              <div className="text-xs text-muted font-medium uppercase tracking-wider">Persona</div>
              <div className="text-sm font-semibold">{isCeoMode ? "CEO Mode" : "Analyst Mode"}</div>
            </div>
          </div>
          <div className="w-8 h-4 bg-background border border-border rounded-full relative">
            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${isCeoMode ? 'right-0.5 bg-primary' : 'left-0.5 bg-muted'}`} />
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Point the Dashboard link to the correct mode based on toggle
          let href = item.href;
          if (item.label === "Dashboard" && isCeoMode) href = "/ceo-dashboard";
          
          return (
            <NavLink
              key={item.label}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-[#0B0F14]"
                    : "text-muted hover:bg-surface hover:text-text"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-card hover:text-text transition-colors w-full">
          <Upload className="w-5 h-5" />
          Upload Logs
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-card hover:text-text transition-colors w-full">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
