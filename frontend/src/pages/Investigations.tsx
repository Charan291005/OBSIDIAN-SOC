import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Plus, ShieldAlert, ArrowRight, User } from "lucide-react";

interface Incident {
  id: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  risk_score: number;
  status: string;
  created_at: string;
}

export default function Investigations() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://obsidian-soc-backend-15k7.onrender.com";
        const response = await axios.get(`${API_URL}/api/v1/incidents`);
        setIncidents(response.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Investigations</h1>
          <p className="text-muted mt-1">Manage and track security incidents</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors w-64"
            />
          </div>
          <button className="p-2 border border-border rounded-lg bg-surface text-muted hover:text-text transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Case
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.map((inc, i) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              onClick={() => navigate(`/investigations/${inc.id}`)}
              className="bg-card border border-border rounded-xl p-5 shadow-soft hover:border-primary/40 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-muted" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-muted">{inc.id.split('-')[0]}...</span>
                      <span className="text-xs text-muted">• {new Date(inc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-text group-hover:text-primary transition-colors">{inc.title}</h3>
                  </div>
                </div>
                <Badge severity={inc.severity} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border/50">
                <div>
                  <div className="text-xs text-muted mb-1">Risk Score</div>
                  <div className="font-mono font-medium">{inc.risk_score}/100</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">AI Confidence</div>
                  <div className="font-mono font-medium">94%</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Status</div>
                  <div className="text-sm font-medium">{inc.status}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <User className="w-4 h-4" />
                  {inc.status === "Open" ? "Unassigned" : "Analyst"}
                </div>
                <span className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
