import { UploadCloud, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const terminalLogs = [
  "[SYSTEM] Initiating secure log ingress...",
  "[INGRESS] Received 4.2MB PCAP data from sensor-04",
  "[PARSER] Normalizing Zeek conn.log formats...",
  "[PARSER] Extracted 12,403 unique connections",
  "[AI_ENGINE] Applying behavioral heuristics to network graph...",
  "[AI_ENGINE] MATCH FOUND: Cobalt Strike Beaconing detected (Confidence: 94%)",
  "[AI_ENGINE] Associated IPs: 185.158.24.x, 192.168.1.42",
  "[SYSTEM] Automatically isolating endpoint DESKTOP-492X...",
  "[SYSTEM] Generating incident report INC-1045..."
];

export default function UploadCenter() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setIsProcessing(true);
    setLogs([]);
    setProgress(0);
    
    // Simulate terminal output
    terminalLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        setProgress(Math.floor(((index + 1) / terminalLogs.length) * 100));
      }, (index + 1) * 800);
    });
    
    setTimeout(() => {
      setIsProcessing(false);
    }, terminalLogs.length * 800 + 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-3xl font-bold font-heading">Upload Security Logs</h1>
        <p className="text-muted">Drag and drop raw logs for automated AI parsing and investigation.</p>
      </div>

      {/* Dropzone */}
      <div 
        onClick={handleUpload}
        className="border-2 border-dashed border-border rounded-xl p-16 text-center hover:bg-surface hover:border-primary/50 transition-colors cursor-pointer group"
      >
        <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8 text-muted group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-medium mb-1">Click to upload or drag and drop</h3>
        <p className="text-sm text-muted">Supports .JSON, .CSV, .LOG, .TXT (Max 50MB)</p>
      </div>

      {/* Terminal Output */}
      <div className="bg-[#0B0F14] border border-border rounded-xl overflow-hidden shadow-soft">
        <div className="bg-surface px-4 py-3 flex items-center gap-2 border-b border-border">
          <Terminal className="w-4 h-4 text-muted" />
          <span className="text-sm font-medium text-muted font-mono">obsidian-core-parser</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-border"></div>
            <div className="w-3 h-3 rounded-full bg-border"></div>
            <div className="w-3 h-3 rounded-full bg-border"></div>
          </div>
        </div>
        <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
          {!isProcessing && logs.length === 0 && (
            <div className="text-muted text-center mt-20">Waiting for log ingestion...</div>
          )}
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-2 ${log.includes('MATCH FOUND') || log.includes('isolating') ? 'text-critical font-bold' : 'text-primary/80'}`}
            >
              <span className="text-muted mr-2">{new Date().toISOString().split('T')[1].slice(0, 8)}</span>
              {log}
            </motion.div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-muted mt-4">
              <span className="animate-pulse">_</span>
              <span className="text-xs">Processing {progress}%...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
