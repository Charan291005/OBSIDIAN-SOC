import { ArrowLeft, Clock, FileText, Activity, ShieldAlert, Paperclip, CheckCircle, Sparkles, User, Save } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Incident } from "../services/api";

export default function InvestigationWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getIncident(id);
        setIncident(data);
        if (data.analyst_notes) {
          setNoteText(data.analyst_notes);
        }
      } catch (error) {
        console.error("Error fetching incident:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleAssignToMe = async () => {
    if (!incident || !id) return;
    setIsAssigning(true);
    try {
      const updated = await api.updateIncident(id, {
        assigned_to: "Lead Analyst",
        status: "In Progress",
      });
      setIncident(updated);
    } catch (err) {
      console.error("Error assigning incident:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleToggleAction = async (actionIndex: number) => {
    if (!incident || !id || !incident.recommended_actions) return;
    const updatedActions = incident.recommended_actions.map((act, idx) =>
      idx === actionIndex ? { ...act, completed: !act.completed } : act
    );
    // Optimistic UI update
    setIncident({ ...incident, recommended_actions: updatedActions });
    try {
      await api.updateIncident(id, { recommended_actions: updatedActions });
    } catch (err) {
      console.error("Error saving action status:", err);
    }
  };

  const handleSaveNote = async () => {
    if (!incident || !id) return;
    try {
      await api.saveIncidentNote(id, noteText);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleGenerateAIReport = () => {
    if (!incident) return;
    navigate("/ai-workspace", {
      state: {
        prefilledQuery: `Generate comprehensive executive report for incident: ${incident.title}. Target host: ${incident.host || 'DESKTOP-492X'}, Risk Score: ${incident.risk_score}/100.`,
        incidentId: incident.id,
      },
    });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-3 py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-sm text-muted">Loading incident investigation workspace...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-12 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-warning mx-auto" />
        <h2 className="text-xl font-bold">Incident Not Found</h2>
        <p className="text-muted text-sm">The requested security case does not exist or was deleted.</p>
        <Link to="/investigations" className="btn-primary inline-flex items-center gap-2 mt-2">
          <ArrowLeft className="w-4 h-4" /> Back to Investigations
        </Link>
      </div>
    );
  }

  const actions = incident.recommended_actions || [
    { action: `Isolate host ${incident.host || "DESKTOP-492X"} from corporate network`, completed: true },
    { action: "Block C2 domain and related IOCs at border gateway", completed: false },
    { action: `Rotate corporate credentials for ${incident.affected_user || "j.doe"}`, completed: false },
  ];

  const mitreTechniques = incident.mitre_techniques || [
    { id: "T1059.001", name: "PowerShell", tactic: "Execution" },
    { id: "T1027", name: "Obfuscated Files or Information", tactic: "Defense Evasion" },
  ];

  const timelineEvents = incident.timeline || [
    { time: "09:12", text: "Raw telemetry alert triggered by EDR sensor", actor: "Sensor" },
    { time: "09:13", text: "Obsidian AI classified suspicious stager payload", actor: "Obsidian AI" },
    { time: "09:16", text: "High priority incident created", actor: "System" },
  ];

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Top Header */}
      <div className="h-16 shrink-0 border-b border-border bg-background px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/investigations"
            className="p-2 text-muted hover:text-text hover:bg-surface rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">{incident.id.slice(0, 8)}...</span>
              <Badge severity={incident.severity} />
              <span className="text-xs bg-surface border border-border px-2 py-0.5 rounded text-muted font-medium">
                {incident.status}
              </span>
            </div>
            <h1 className="font-semibold mt-0.5 text-lg text-text truncate max-w-xl">{incident.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAssignToMe}
            disabled={isAssigning || incident.assigned_to === "Lead Analyst"}
            className="px-3.5 py-1.5 text-xs font-medium text-text bg-surface border border-border rounded-lg hover:bg-card transition-colors flex items-center gap-1.5 disabled:opacity-60"
          >
            <User className="w-3.5 h-3.5 text-primary" />
            {incident.assigned_to === "Lead Analyst" ? "Assigned to You" : "Assign to me"}
          </button>
          <button
            onClick={handleGenerateAIReport}
            className="btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate AI Report
          </button>
        </div>
      </div>

      {/* 3-Panel SOC Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Timeline */}
        <div className="w-72 shrink-0 border-r border-border bg-surface/40 overflow-y-auto p-5 hidden lg:block">
          <h3 className="font-semibold text-xs text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Incident Timeline
          </h3>

          <div className="relative border-l border-border ml-2 space-y-6">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="pl-6 relative">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-surface border-2 border-primary rounded-full" />
                <div className="text-xs text-muted mb-0.5 font-mono">{event.time}</div>
                <div className="font-medium text-xs text-text">{event.text}</div>
                <div className="text-[10px] text-muted mt-0.5">by {event.actor}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel: Main Findings & Actions */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* AI Findings */}
            <section>
              <h2 className="text-lg font-bold font-heading mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> AI Findings & Telemetry
              </h2>
              <Card className="prose prose-invert max-w-none text-sm text-text bg-card/60">
                <p className="leading-relaxed">{incident.description}</p>
              </Card>
            </section>

            {/* MITRE ATT&CK Mapping */}
            <section>
              <h2 className="text-lg font-bold font-heading mb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-warning" /> MITRE ATT&CK Matrix
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mitreTechniques.map((tech) => (
                  <div key={tech.id} className="p-4 rounded-lg bg-surface border border-border">
                    <div className="font-mono text-xs text-primary font-semibold mb-1">{tech.id}</div>
                    <div className="font-medium text-sm text-text">{tech.name}</div>
                    <div className="text-xs text-muted mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                      {tech.tactic} Tactic
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Actions Checklist */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold font-heading">Remediation Checklist</h2>
                <span className="text-xs text-muted font-mono">
                  {completedCount}/{actions.length} Completed
                </span>
              </div>
              <div className="space-y-2.5">
                {actions.map((act, i) => (
                  <label
                    key={i}
                    onClick={() => handleToggleAction(i)}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                      act.completed
                        ? "bg-surface/30 border-success/30 text-muted line-through"
                        : "bg-surface border-border hover:border-primary/40 text-text"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={act.completed}
                      onChange={() => {}} // Handled by label click
                      className="rounded border-muted text-primary focus:ring-primary/20 bg-transparent w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-medium">{act.action}</span>
                    {act.completed && <CheckCircle className="w-4 h-4 text-success ml-auto shrink-0" />}
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right Panel: Attributes & Analyst Notes */}
        <div className="w-80 shrink-0 border-l border-border bg-surface/50 overflow-y-auto p-5 hidden xl:block">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-xs text-muted uppercase tracking-wider mb-3">
                Incident Context
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted text-xs">Host Target</span>
                  <span className="font-mono text-xs font-medium text-text">
                    {incident.host || "DESKTOP-492X"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted text-xs">Affected Account</span>
                  <span className="font-mono text-xs font-medium text-text">
                    {incident.affected_user || "j.doe"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted text-xs">Origin IP</span>
                  <span className="font-mono text-xs font-medium text-text">
                    {incident.source_ip || "192.168.1.105"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted text-xs">Risk Rating</span>
                  <span className="font-mono text-xs font-bold text-critical">
                    {incident.risk_score}/100
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted text-xs">Assigned Lead</span>
                  <span className="text-xs font-medium text-text">
                    {incident.assigned_to || "Unassigned"}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-xs text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Analyst Notes
                </h3>
                {noteSaved && (
                  <span className="text-[11px] text-success font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Saved!
                  </span>
                )}
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-3 text-xs text-text resize-none focus:outline-none focus:border-primary transition-colors min-h-[130px]"
                placeholder="Log containment actions, forensic hashes, or handoff notes..."
              ></textarea>
              <button
                onClick={handleSaveNote}
                className="w-full mt-2 py-2 text-xs font-semibold bg-surface border border-border hover:bg-card hover:border-primary/50 text-text rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-primary" /> Save Analyst Note
              </button>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="font-semibold text-xs text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-muted" /> Attached Evidence
              </h3>
              <div className="p-3 bg-background border border-border rounded-lg flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium text-text">sysmon_packet_triage.csv</span>
                </div>
                <span className="text-[10px] text-muted">1.2 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

