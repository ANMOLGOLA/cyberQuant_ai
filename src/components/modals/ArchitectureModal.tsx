import { Shield, Database, Cpu, Sliders, BarChart3, CheckCircle2, X } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A1128] border border-cyan-500/20 rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              CyberQuant AI Architecture & Data Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end telemetry ingestion, quantitative modeling, Monte Carlo simulation, and investment optimization.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Diagram Grid */}
        <div className="mt-6 space-y-6">
          {/* Layer 1: Ingestion */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400 mb-2">
              <Database className="w-4 h-4" />
              <span>Layer 1: Continuous Multi-Source Telemetry Ingestion</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Standardized connectors normalize streaming events and periodic audit sweeps from 7 technical silos:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="font-mono text-cyan-300">Vuln Mgmt:</span> Tenable / Qualys (CVEs, CVSS, EPSS)
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="font-mono text-cyan-300">SIEM:</span> Splunk / Elastic (Audit logs, anomalous events)
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="font-mono text-cyan-300">IAM:</span> Okta / Entra (Privilege drift, MFA status)
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="font-mono text-cyan-300">EDR:</span> CrowdStrike Falcon (Endpoint coverage, alerts)
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="font-mono text-cyan-300">CSPM:</span> Wiz / Prisma Cloud (Cloud buckets, IAM roles)
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="font-mono text-cyan-300">CMDB:</span> ServiceNow (Asset dependencies, business units)
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80 col-span-2">
                <span className="font-mono text-cyan-300">Threat Intel:</span> Recorded Future & CISA KEV (Weaponized exploits in wild)
              </div>
            </div>
          </div>

          {/* Layer 2: Mathematical Engine */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-400 mb-2">
              <Cpu className="w-4 h-4" />
              <span>Layer 2: Real-Time Quantitative Risk & Monte Carlo Engine</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="font-medium text-violet-300 mb-1">Likelihood & Impact Formulas</div>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                  <p>P = 1 - ∏(1 - p_i) across vulnerabilities</p>
                  <p>p_i = EPSS × Threat_Mult × Exposure × (1 - Ctrl_Eff)</p>
                  <p>Impact = Downtime + Breach + Regulatory + Reputational</p>
                  <p>EAL = Likelihood × Impact (in ₹)</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="font-medium text-violet-300 mb-1">Monte Carlo Simulation (5,000 runs)</div>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                  <p>Occurrence: Bernoulli draw ~ P(Asset)</p>
                  <p>Severity: Lognormal draw ~ (μ, σ²) around Impact</p>
                  <p>Output: EAL, VaR 90%, VaR 95%, VaR 99%, CVaR</p>
                  <p>Loss distribution histogram & tail percentile analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Decision & Optimization */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
              <Sliders className="w-4 h-4" />
              <span>Layer 3: Investment Optimization & What-If Simulation</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Capital allocation engine solves 0/1 Knapsack optimization to maximize risk reduction under fixed budget constraints.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                <div className="font-semibold text-emerald-300 mb-1">0/1 Knapsack Solver</div>
                <p className="text-slate-400">Dynamic programming knapsack allocating budget across candidate projects for optimal ROSI.</p>
              </div>
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                <div className="font-semibold text-emerald-300 mb-1">What-If Lab</div>
                <p className="text-slate-400">Live parameter manipulation (MFA %, Patch SLA, Segmentation, EDR) with instant recalculation.</p>
              </div>
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                <div className="font-semibold text-emerald-300 mb-1">AI Copilot</div>
                <p className="text-slate-400">Gemini 3.8 Flash model with local deterministic intent engine for plain-English financial Q&A.</p>
              </div>
            </div>
          </div>

          {/* Layer 4: Output Dashboards */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>Layer 4: Executive, Technical & Compliance Governance</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CISO / Board Dashboard
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Technical Asset Drill-down
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> RBI CSF / SEBI CSCRF / DPDP Act Audits
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> One-Click Board Memo Export
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
