import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Card } from "../components/ui/Card";
import { ShieldCheck, AlertTriangle, Crosshair, Clock, Zap, Activity, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import type { AnalyticsOverview } from "../services/api";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const analytics = await api.getAnalytics();
        setData(analytics);
      } catch (err) {
        console.error("Error loading dashboard telemetry:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const kpis = [
    {
      label: "Security Health",
      value: data ? data.kpis.security_health : "94/100",
      icon: ShieldCheck,
      color: "text-success",
    },
    {
      label: "Active Incidents",
      value: data ? String(data.kpis.active_incidents) : "4",
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      label: "Critical Threats",
      value: data ? String(data.kpis.critical_threats) : "2",
      icon: Crosshair,
      color: "text-critical",
    },
    {
      label: "Total Investigations",
      value: data ? String(data.kpis.investigations_today) : "5",
      icon: Clock,
      color: "text-primary",
    },
  ];

  const suggested = data?.suggested_priority;

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-sm text-muted">Retrieving mission control telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-3xl font-bold font-heading">Mission Control</h1>
        <p className="text-muted mt-1.5 text-base">
          Autonomous SOC threat telemetry, active cases, and perimeter posture.
        </p>
      </motion.div>

      {/* KPI Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={item}>
            <Card hoverable className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted">{kpi.label}</h3>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="text-4xl font-bold font-mono tracking-tight">{kpi.value}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Briefing Card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className="h-full bg-gradient-to-br from-card to-surface border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-48 h-48 text-primary" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading">Daily Autonomous AI Brief</h2>
                  <div className="text-xs text-muted">Correlated from active SIEM & EDR telemetry streams</div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {data?.ai_brief ? (
                  data.ai_brief.map((brief, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      <span className="text-text text-sm">{brief}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      <span className="text-text text-sm">4 incidents require manual review by an analyst.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-critical mt-2 shrink-0" />
                      <span className="text-text text-sm">
                        Credential access activity increased by 35% on internal network.
                      </span>
                    </li>
                  </>
                )}
              </ul>

              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="text-xs text-muted uppercase tracking-wider font-semibold mb-2">
                  Suggested Action Priority
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-text block">
                      {suggested ? suggested.title : "Investigate Cobalt Strike Execution (DESKTOP-492X)"}
                    </span>
                    <span className="text-xs text-muted">
                      Target: {suggested?.host || "DESKTOP-492X"} • Risk Score: {suggested?.risk_score || 98}/100
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (suggested?.id) {
                        navigate(`/investigations/${suggested.id}`);
                      } else {
                        navigate("/investigations");
                      }
                    }}
                    className="btn-primary py-2 px-4 text-xs font-semibold shrink-0 flex items-center justify-center gap-1.5"
                  >
                    Open Case <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full">
            <h3 className="text-lg font-semibold font-heading mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted" /> Live Ingress Feed
            </h3>

            <div className="relative border-l border-border ml-3 space-y-6">
              {(data?.recent_activity || [
                { time: "09:20", text: "Marked High Priority", action: "System" },
                { time: "09:18", text: "Executive Report Generated", action: "AI Agent" },
                { time: "09:16", text: "Incident Created (INC-1002)", action: "System" },
                { time: "09:13", text: "AI Investigation Started", action: "AI Agent" },
                { time: "09:12", text: "Windows Log Uploaded", action: "Sensor" },
              ]).map((event, i) => (
                <div key={i} className="pl-6 relative">
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-surface border-2 border-primary rounded-full" />
                  <div className="text-xs text-muted mb-0.5 font-mono">{event.time}</div>
                  <div className="font-medium text-xs text-text">{event.text}</div>
                  <div className="text-[10px] text-muted mt-0.5">by {event.action}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

