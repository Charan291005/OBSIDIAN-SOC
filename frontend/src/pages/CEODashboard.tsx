import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Card } from "../components/ui/Card";
import { TrendingUp, ShieldAlert, Activity, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const riskData = [
  { name: 'Mon', risk: 42 },
  { name: 'Tue', risk: 38 },
  { name: 'Wed', risk: 55 },
  { name: 'Thu', risk: 45 },
  { name: 'Fri', risk: 30 },
  { name: 'Sat', risk: 25 },
  { name: 'Sun', risk: 15 },
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

export default function CEODashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-heading">Executive Overview</h1>
          <p className="text-muted mt-2 text-lg">
            Organizational Security Posture
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted uppercase tracking-wider">Overall Risk Score</div>
          <div className="text-4xl font-bold text-success font-mono">92<span className="text-lg text-muted">/100</span></div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <Card hoverable className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Active Threats</h3>
              <ShieldAlert className="w-5 h-5 text-warning" />
            </div>
            <div className="text-4xl font-bold font-mono tracking-tight">3</div>
            <div className="mt-2 text-xs text-muted flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-success" /> -2 from last week
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card hoverable className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Mean Time to Resolve</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-4xl font-bold font-mono tracking-tight">42<span className="text-xl">m</span></div>
            <div className="mt-2 text-xs text-muted flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-success" /> -12% vs last month
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card hoverable className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Incidents Prevented</h3>
              <ShieldAlert className="w-5 h-5 text-success" />
            </div>
            <div className="text-4xl font-bold font-mono tracking-tight">1,204</div>
            <div className="mt-2 text-xs text-muted">Last 30 days</div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card hoverable className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Affected Users</h3>
              <Users className="w-5 h-5 text-critical" />
            </div>
            <div className="text-4xl font-bold font-mono tracking-tight">1</div>
            <div className="mt-2 text-xs text-muted">Currently compromised</div>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Executive Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> AI Executive Summary
                </h3>
                <span className="text-xs text-muted">Generated Today, 08:00 AM</span>
             </div>
            
            <div className="prose prose-invert max-w-none text-sm text-muted">
              <p className="text-text leading-relaxed">
                The organization's security posture remains strong. Over the last 24 hours, the Obsidian AI engine automatically blocked 1,204 low-level scanning attempts and successfully isolated one endpoint (DESKTOP-492X) exhibiting Cobalt Strike behavior. 
              </p>
              <p className="text-text leading-relaxed mt-4">
                <strong>Business Impact:</strong> Zero data exfiltration detected. The isolated endpoint belongs to the marketing department and did not have access to sensitive financial data. Analyst team is currently investigating the initial vector.
              </p>
              
              <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
                <h4 className="text-text font-medium mb-2">Recommended Board Updates</h4>
                <ul className="space-y-2 mb-0">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Approve Q3 budget expansion for additional EDR licenses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Mandate updated Phishing awareness training for marketing department.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Interactive Charts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="h-full">
            <h3 className="text-lg font-semibold font-heading mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Organizational Risk Trend
            </h3>
            
            <div className="h-48 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F14', border: '1px solid #30363d', borderRadius: '8px' }}
                    itemStyle={{ color: '#ec4899' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="#ec4899" fillOpacity={1} fill="url(#colorRisk)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
