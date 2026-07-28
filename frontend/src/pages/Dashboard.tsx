import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Card } from "../components/ui/Card";
import { ShieldCheck, AlertTriangle, Crosshair, Clock, Zap, Activity } from "lucide-react";

const kpis = [
  { label: "Security Health", value: "94/100", icon: ShieldCheck, color: "text-success" },
  { label: "Active Incidents", value: "12", icon: AlertTriangle, color: "text-warning" },
  { label: "Critical Threats", value: "2", icon: Crosshair, color: "text-critical" },
  { label: "Investigations Today", value: "28", icon: Clock, color: "text-primary" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold font-heading">Good Morning, Charan.</h1>
        <p className="text-muted mt-2 text-lg">
          No critical incidents detected during the last 6 hours.
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
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
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
                <h2 className="text-xl font-bold font-heading">Daily AI Brief</h2>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                  <span className="text-text">4 incidents require manual review by an analyst.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-critical mt-2 shrink-0" />
                  <span className="text-text">Credential access activity increased by 35% on internal network.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-info mt-2 shrink-0" />
                  <span className="text-text">Average risk score increased 12% across endpoints.</span>
                </li>
              </ul>

              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="text-sm text-muted uppercase tracking-wider font-semibold mb-2">Suggested Priority</h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Investigate Incident #142 (Suspicious PowerShell)</span>
                  <button className="text-sm font-medium text-[#0B0F14] bg-primary px-3 py-1.5 rounded hover:opacity-90 transition-opacity">
                    Open Case
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <h3 className="text-lg font-semibold font-heading mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted" /> Live Activity Feed
            </h3>
            
            <div className="relative border-l border-border ml-3 space-y-6">
              {[
                { time: "09:20", text: "Marked High Priority", action: "System" },
                { time: "09:18", text: "Executive Report Generated", action: "AI Agent" },
                { time: "09:16", text: "Incident Created (INC-1002)", action: "System" },
                { time: "09:13", text: "AI Investigation Started", action: "AI Agent" },
                { time: "09:12", text: "Windows Log Uploaded", action: "Charan" },
              ].map((event, i) => (
                <div key={i} className="pl-6 relative">
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 bg-surface border-2 border-primary rounded-full" />
                  <div className="text-xs text-muted mb-1 font-mono">{event.time}</div>
                  <div className="font-medium text-sm text-text">{event.text}</div>
                  <div className="text-xs text-muted mt-1">by {event.action}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
