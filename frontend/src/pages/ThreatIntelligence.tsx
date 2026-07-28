import { ShieldAlert, Crosshair, Globe, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mitreData = [
  { technique: 'T1059 (Cmd/Script)', count: 120 },
  { technique: 'T1027 (Obfuscation)', count: 98 },
  { technique: 'T1566 (Phishing)', count: 86 },
  { technique: 'T1003 (Credential Dumping)', count: 75 },
  { technique: 'T1190 (Exploit Public-Facing App)', count: 42 },
  { technique: 'T1071 (Application Layer Protocol)', count: 38 },
];

export default function ThreatIntelligence() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading">Threat Intelligence</h1>
        <p className="text-muted mt-1">Global and local threat landscape</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Crosshair className="w-4 h-4 text-warning" />
            <span className="text-sm text-muted font-medium">Top Technique</span>
          </div>
          <div className="font-mono text-lg text-text">T1059 (Cmd/Script)</div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-4 h-4 text-critical" />
            <span className="text-sm text-muted font-medium">Fastest Growing</span>
          </div>
          <div className="font-mono text-lg text-text">Credential Dumping</div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-4 h-4 text-info" />
            <span className="text-sm text-muted font-medium">Top Source</span>
          </div>
          <div className="font-mono text-lg text-text">Russian Fed. (32%)</div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted font-medium">Active Campaigns</span>
          </div>
          <div className="font-mono text-lg text-text">3 Tracked</div>
        </Card>
      </div>

      <Card className="min-h-[400px]">
        <h3 className="text-lg font-semibold font-heading mb-6">MITRE ATT&CK Matrix (30 Days)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={mitreData} margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
              <XAxis type="number" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="technique" type="category" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} width={150} />
              <Tooltip 
                cursor={{fill: '#1c2128'}}
                contentStyle={{ backgroundColor: '#0B0F14', border: '1px solid #30363d', borderRadius: '8px' }}
                itemStyle={{ color: '#00e5ff' }}
              />
              <Bar dataKey="count" fill="#00e5ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
