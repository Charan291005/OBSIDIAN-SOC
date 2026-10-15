import { Activity, Copy, Check, Download, Sparkles, Shield } from "lucide-react";
import { Card } from "../components/ui/Card";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import ReactMarkdown from "react-markdown";
import { api } from "../services/api";

const PROMPT_SUGGESTIONS = [
  "Generate an executive briefing for a volumetric UDP DDoS attack.",
  "Investigate obfuscated PowerShell executing Cobalt Strike stager.",
  "Analyze spear-phishing campaign targeting finance team with XLSM macro.",
  "Create remediation plan for LSASS memory dumping on workstation DEV-99.",
  "Assess organizational blast radius for ransomware canary alert on file server.",
];

export default function AIWorkspace() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [incidentId, setIncidentId] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [reportText, setReportText] = useState("");
  const [confidence, setConfidence] = useState(95);
  const [reportSource, setReportSource] = useState("Obsidian AI Engine");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(
    async (overrideQuery?: string) => {
      const activeQuery = overrideQuery || query;
      if (!activeQuery.trim()) return;

      setIsGenerating(true);
      setShowResult(false);

      try {
        const response = await api.generateAIReport(activeQuery, incidentId);
        setReportText(response.report);
        setConfidence(response.confidence);
        setReportSource(response.source);
        setShowResult(true);
      } catch (error) {
        console.error("Error generating report:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [query, incidentId]
  );

  // Check if routed from an incident with prefilled query
  useEffect(() => {
    if (location.state?.prefilledQuery) {
      setQuery(location.state.prefilledQuery);
      if (location.state.incidentId) {
        setIncidentId(location.state.incidentId);
      }
      handleGenerate(location.state.prefilledQuery);
    }
  }, [location.state, handleGenerate]);

  const handleCopy = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Obsidian_SOC_Report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">AI Investigation Workspace</h1>
          <p className="text-muted mt-1">
            Autonomous threat investigation, MITRE ATT&CK mapping, and executive briefing engine powered by Gemini.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="E.g. Analyze Cobalt Strike stager and provide isolation commands..."
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm text-text"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !query.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-5"
          >
            {isGenerating ? (
              <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Investigate
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-muted font-medium mr-1">Suggested Scenarios:</span>
          {PROMPT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sug);
                handleGenerate(sug);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-muted hover:text-text hover:border-primary/40 transition-colors truncate max-w-xs"
            >
              {sug.split(".")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Report Card */}
      {showResult && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="mt-8 relative group border-primary/30">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-heading text-text">Security Intelligence Report</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30 font-medium font-mono">
                      {confidence}% Confidence
                    </span>
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    Generated via <strong className="text-text">{reportSource}</strong> • Real-time SOC Analysis
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  title="Copy Markdown Report"
                  className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-md text-muted hover:text-text transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  title="Download as Markdown"
                  className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-md text-muted hover:text-text transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  Export .md
                </button>
              </div>
            </div>

            {/* Markdown Report Content */}
            <div className="prose prose-invert max-w-none text-sm text-text leading-relaxed space-y-4">
              <ReactMarkdown>{reportText}</ReactMarkdown>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State Prompt */}
      {!showResult && !isGenerating && (
        <div className="mt-12 text-center py-16 border border-dashed border-border rounded-xl p-8 space-y-3">
          <Shield className="w-12 h-12 text-muted mx-auto" />
          <h3 className="text-lg font-semibold text-text">Autonomous SOC Intelligence</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Ask any question regarding ongoing threats, provide suspicious PowerShell commands, or choose one of the
            suggested scenarios above to generate instant forensic assessments.
          </p>
        </div>
      )}
    </div>
  );
}

