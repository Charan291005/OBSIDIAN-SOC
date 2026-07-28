import { ArrowLeft, Clock, FileText, Activity, ShieldAlert, Paperclip } from "lucide-react";
import { Link, useParams } from "react-router";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { useState, useEffect } from "react";
import axios from "axios";

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: string;
  created_at: string;
}

export default function InvestigationWorkspace() {
  const { id } = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/incidents/${id}`);
        setIncident(response.data);
      } catch (error) {
        console.error("Error fetching incident:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIncident();
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!incident) {
    return <div className="p-8 text-center text-muted">Incident not found.</div>;
  }

  return (
    <div className="h-full flex flex-col -m-6"> {/* Negative margin to overcome DashboardLayout padding for full height */}
      
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-border bg-background px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/investigations" className="p-2 text-muted hover:text-text hover:bg-surface rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-muted">{incident.id.split('-')[0]}...</span>
              <Badge severity={incident.severity} />
              <span className="text-xs bg-surface px-2 py-0.5 rounded text-muted">{incident.status}</span>
            </div>
            <h1 className="font-semibold mt-0.5 text-lg">{incident.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm font-medium text-text bg-surface border border-border rounded hover:bg-card transition-colors">
            Assign to me
          </button>
          <button className="btn-primary py-1.5 text-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Timeline */}
        <div className="w-72 shrink-0 border-r border-border bg-surface/50 overflow-y-auto p-4 hidden lg:block">
          <h3 className="font-medium text-sm text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Timeline
          </h3>
          
          <div className="relative border-l border-border ml-2 space-y-8">
            <div className="pl-6 relative">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-surface border-2 border-primary rounded-full" />
              <div className="text-xs text-muted mb-1 font-mono">{new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div className="font-medium text-sm text-text">Incident Auto-Created</div>
            </div>
          </div>
        </div>

        {/* Center Panel: Main AI Findings */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> AI Findings
              </h2>
              <Card className="prose prose-invert max-w-none text-sm text-muted">
                <p className="text-text leading-relaxed">
                  {incident.description}
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-warning" /> MITRE ATT&CK
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <div className="font-mono text-xs text-primary mb-1">T1059.001</div>
                  <div className="font-medium text-sm">PowerShell</div>
                  <div className="text-xs text-muted mt-2">Execution Tactic</div>
                </div>
                <div className="p-4 rounded-lg bg-surface border border-border">
                  <div className="font-mono text-xs text-primary mb-1">T1027</div>
                  <div className="font-medium text-sm">Obfuscated Files or Information</div>
                  <div className="text-xs text-muted mt-2">Defense Evasion</div>
                </div>
              </div>
            </section>
            
            <section>
               <h2 className="text-xl font-bold font-heading mb-4">Recommended Actions</h2>
               <div className="space-y-3">
                 <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-card transition-colors cursor-pointer">
                   <input type="checkbox" className="rounded border-muted text-primary focus:ring-primary/20 bg-transparent" />
                   <span className="text-sm">Isolate host 192.168.1.105 from the network</span>
                 </label>
                 <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-card transition-colors cursor-pointer">
                   <input type="checkbox" className="rounded border-muted text-primary focus:ring-primary/20 bg-transparent" />
                   <span className="text-sm">Block domain communication at the firewall level</span>
                 </label>
               </div>
            </section>
          </div>
        </div>

        {/* Right Panel: Context & Notes */}
        <div className="w-80 shrink-0 border-l border-border bg-surface overflow-y-auto p-4 hidden xl:block">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-sm text-muted uppercase tracking-wider mb-3">Attributes</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Host</span>
                  <span className="font-medium">DESKTOP-492X</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">User</span>
                  <span className="font-medium">j.doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">IP Address</span>
                  <span className="font-mono">192.168.1.105</span>
                </div>
              </div>
            </div>
            
            <hr className="border-border" />
            
            <div>
              <h3 className="font-medium text-sm text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Analyst Notes
              </h3>
              <textarea 
                className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                placeholder="Add notes here..."
              ></textarea>
              <button className="w-full mt-2 py-1.5 text-xs font-medium bg-card border border-border hover:bg-background rounded transition-colors">
                Save Note
              </button>
            </div>
            
            <hr className="border-border" />
            
            <div>
              <h3 className="font-medium text-sm text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" /> Evidence
              </h3>
              <div className="p-3 bg-background border border-border rounded flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium">sysmon_logs.csv</span>
                </div>
                <span className="text-xs text-muted">1.2 MB</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
