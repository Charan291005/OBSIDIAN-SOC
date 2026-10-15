import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "../components/ui/Badge";
import { Search, Plus, ShieldAlert, ArrowRight, User, X, CheckCircle, Shield } from "lucide-react";
import { api } from "../services/api";
import type { Incident, IncidentCreateInput } from "../services/api";

export default function Investigations() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [showNewModal, setShowNewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Case Form State
  const [formData, setFormData] = useState<IncidentCreateInput>({
    title: "",
    severity: "High",
    risk_score: 85,
    host: "DESKTOP-882Z",
    affected_user: "a.smith",
    description: "",
  });

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error("Error loading incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createIncident(formData);
      setShowNewModal(false);
      setFormData({
        title: "",
        severity: "High",
        risk_score: 85,
        host: "DESKTOP-882Z",
        affected_user: "a.smith",
        description: "",
      });
      setIncidents((prev) => [created, ...prev]);
      navigate(`/investigations/${created.id}`);
    } catch (err) {
      console.error("Error creating incident:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSearch =
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inc.host && inc.host.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSeverity =
        severityFilter === "All" || inc.severity.toLowerCase() === severityFilter.toLowerCase();
      return matchesSearch && matchesSeverity;
    });
  }, [incidents, searchTerm, severityFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Investigations</h1>
          <p className="text-muted mt-1">Manage, triage, and track enterprise security incidents</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, host, IOC..."
              className="bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors w-64 text-text"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            {["All", "Critical", "High", "Medium"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  severityFilter === sev
                    ? "bg-primary text-[#0B0F14] font-semibold"
                    : "text-muted hover:text-text hover:bg-card"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Case
          </button>
        </div>
      </div>

      {/* Grid or Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-sm text-muted">Retrieving incident telemetry...</p>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl p-8 space-y-3">
          <Shield className="w-12 h-12 text-muted mx-auto" />
          <h3 className="text-lg font-semibold text-text">No incidents found</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            {searchTerm || severityFilter !== "All"
              ? "No security cases match your active filters. Try clearing your search query."
              : "All incident queues are clear. Open a new case or ingest security logs."}
          </p>
          {(searchTerm || severityFilter !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSeverityFilter("All");
              }}
              className="text-xs text-primary underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIncidents.map((inc, i) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}
              onClick={() => navigate(`/investigations/${inc.id}`)}
              className="bg-card border border-border rounded-xl p-5 shadow-soft hover:border-primary/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                    <ShieldAlert
                      className={`w-5 h-5 ${
                        inc.severity === "Critical"
                          ? "text-critical"
                          : inc.severity === "High"
                          ? "text-warning"
                          : "text-info"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-muted">
                        {inc.id.slice(0, 8)}...
                      </span>
                      <span className="text-xs text-muted">
                        • {new Date(inc.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-text group-hover:text-primary transition-colors">
                      {inc.title}
                    </h3>
                  </div>
                </div>
                <Badge severity={inc.severity} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border/50 text-center sm:text-left">
                <div>
                  <div className="text-xs text-muted mb-1">Risk Score</div>
                  <div className="font-mono font-medium text-text">{inc.risk_score}/100</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Host Target</div>
                  <div className="font-mono text-xs font-medium text-text truncate">
                    {inc.host || "DESKTOP-492X"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Status</div>
                  <div className="text-xs font-semibold px-2 py-0.5 rounded inline-block bg-surface border border-border text-text">
                    {inc.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <User className="w-4 h-4" />
                  <span>{inc.assigned_to ? String(inc.assigned_to) : "Unassigned Queue"}</span>
                </div>
                <span className="flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  Open Investigation <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Case Creation Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold font-heading">Open New Security Investigation</h2>
                </div>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="p-1 text-muted hover:text-text rounded-md hover:bg-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCase} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                    Incident Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.g. Suspicious DLL Injection into explorer.exe"
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                      Severity
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          severity: e.target.value as "Low" | "Medium" | "High" | "Critical",
                        })
                      }
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                      Risk Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.risk_score}
                      onChange={(e) => setFormData({ ...formData, risk_score: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                      Target Hostname
                    </label>
                    <input
                      type="text"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      placeholder="DESKTOP-882Z"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                      Affected User
                    </label>
                    <input
                      type="text"
                      value={formData.affected_user}
                      onChange={(e) => setFormData({ ...formData, affected_user: e.target.value })}
                      placeholder="a.smith"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                    Telemetry & Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe behavioral observations, observed hashes, or parent-child processes..."
                    className="w-full bg-surface border border-border rounded-lg p-3 text-sm text-text resize-none focus:outline-none focus:border-primary transition-colors"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 text-sm font-medium text-muted hover:text-text rounded-lg hover:bg-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim()}
                    className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Create Investigation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

