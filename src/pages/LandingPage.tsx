import { useState, useEffect } from 'react';
import { formatRupees, EnterpriseRiskMetrics } from '../lib/riskEngine';
import { 
  Shield, 
  ArrowRight, 
  Cpu, 
  Sliders, 
  Layers, 
  Lock, 
  Terminal, 
  Activity, 
  Zap, 
  Check, 
  AlertTriangle,
  Flame,
  Radio,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDemo: () => void;
  metrics: EnterpriseRiskMetrics;
}

export function LandingPage({ onLaunchDemo, metrics }: LandingPageProps) {
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const sparklineBars = [35, 42, 50, 48, 62, 58, 70, 65, 84, 92, 78, 88];

  return (
    <div className="min-h-screen bg-[#020508] text-slate-200 cyber-grid-bg selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Cyber Command Bar */}
      <div className="w-full bg-[#030a08] border-b border-emerald-500/25 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold tracking-wider">[SYS_STATUS: ACTIVE]</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">TELEMETRY_PIPELINES: 7/7 NOMINAL</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>LATENCY: 42ms</span>
          <span className="text-slate-600">|</span>
          <span>TARGET: AARAV_FINSERVE_LTD</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">GRID: ONLINE</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Cyber Terminal Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#041410] border border-emerald-500/40 text-emerald-400 text-xs font-mono mb-5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider">SMART INDIA HACKATHON 2024 · CYBER DEFENSE AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-none">
            CYBER RISK, <span className="text-emerald-400 glow-green">QUANTIFIED</span> IN <span className="text-cyan-400 glow-cyan">₹ RUPEES.</span>
          </h1>

          {/* Single clean subtitle - no text wall */}
          <p className="mt-4 text-xs sm:text-sm font-mono text-slate-300 max-w-xl mx-auto leading-relaxed">
            Continuous monetary risk engine translating SIEM, EDR & vulnerability telemetry into Expected Annual Loss and optimal 0/1 Knapsack security investments.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 font-mono">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              <span>❯ LAUNCH MISSION CONSOLE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="#pipeline"
              className="px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-emerald-300 bg-[#061410] hover:bg-[#0a201a] border border-emerald-500/30 rounded transition-colors"
            >
              ❯ HOW IT WORKS
            </a>
          </div>
        </div>

        {/* Terminal HUD Exposure Widget */}
        <div className="mt-10 max-w-3xl mx-auto terminal-card rounded border border-emerald-500/40 overflow-hidden shadow-2xl">
          {/* Terminal Window Header */}
          <div className="bg-[#030907] px-4 py-2 border-b border-emerald-500/30 flex items-center justify-between font-mono text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="text-slate-500 font-semibold ml-2">root@artharisk-engine:~#</span>
              <span className="text-emerald-400">run-risk-eval --target aarav-finserve</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>LIVE_RUN</span>
            </div>
          </div>

          {/* Terminal HUD Core Metrics */}
          <div className="p-5 sm:p-6 bg-[#040f0c]/90 font-mono">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-emerald-500/20">
              
              {/* EAL */}
              <div className="p-3 rounded bg-[#020806] border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block tracking-wider">EXPECTED_ANNUAL_LOSS</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 glow-green tabular-nums mt-1">
                  {formatRupees(metrics.totalEal)}
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">Weighted avg exposure</span>
              </div>

              {/* VaR 95% */}
              <div className="p-3 rounded bg-[#020806] border border-rose-500/30">
                <span className="text-[10px] text-slate-400 block tracking-wider">95%_TAIL_VALUE_AT_RISK</span>
                <div className="text-xl sm:text-2xl font-black text-rose-400 glow-red tabular-nums mt-1">
                  {formatRupees(metrics.totalEal * 2.85)}
                </div>
                <span className="text-[9px] text-rose-400/80 block mt-0.5">1-in-20yr stress event</span>
              </div>

              {/* Risk Appetite Delta */}
              <div className="p-3 rounded bg-[#020806] border border-amber-500/30">
                <span className="text-[10px] text-slate-400 block tracking-wider">APPETITE_EXCESS</span>
                <div className="text-xl sm:text-2xl font-black text-amber-400 glow-amber tabular-nums mt-1">
                  +{formatRupees(Math.max(0, metrics.totalEal - metrics.riskAppetiteLimit))}
                </div>
                <span className="text-[9px] text-amber-400/80 block mt-0.5">Limit: {formatRupees(metrics.riskAppetiteLimit)}</span>
              </div>

              {/* Optimizer ROSI */}
              <div className="p-3 rounded bg-[#020806] border border-cyan-500/30">
                <span className="text-[10px] text-slate-400 block tracking-wider">KNAPSACK_ROSI</span>
                <div className="text-xl sm:text-2xl font-black text-cyan-400 glow-cyan tabular-nums mt-1">
                  +282%
                </div>
                <span className="text-[9px] text-cyan-400/80 block mt-0.5">₹1 Cr budget plan</span>
              </div>

            </div>

            {/* Sparkline & Vector Alert */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-rose-300 bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 rounded">
                <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-[11px] font-semibold">
                  TOP_DRIVER: Fortinet SSL-VPN Gateway (CVE-2024-21762 - Exploit Active)
                </span>
              </div>

              {/* Real-time telemetry sparkline */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">30D_TRAJECTORY:</span>
                <div className="flex items-end gap-1 h-5">
                  {sparklineBars.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-t transition-all ${
                        idx === sparklineBars.length - 1 ? 'bg-emerald-400 h-5' : 'bg-emerald-800/60 h-2.5'
                      }`}
                      style={{ height: `${(val / 100) * 20}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cyber Telemetry Stats Strip */}
      <section className="border-y border-emerald-500/25 bg-[#030907] py-4 px-4 md:px-8 font-mono">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-2 border-r border-emerald-500/10 last:border-0">
            <div className="text-xl font-bold text-emerald-400 glow-green">07 PIPELINES</div>
            <div className="text-[10px] text-slate-400 mt-0.5">SIEM, IAM, EDR, CSPM, VULNS</div>
          </div>
          <div className="p-2 border-r border-emerald-500/10 last:border-0">
            <div className="text-xl font-bold text-cyan-400 glow-cyan">48 ASSETS</div>
            <div className="text-[10px] text-slate-400 mt-0.5">CONTINUOUS FINANCIAL TRACKING</div>
          </div>
          <div className="p-2 border-r border-emerald-500/10 last:border-0">
            <div className="text-xl font-bold text-amber-400 glow-amber">05 FRAMEWORKS</div>
            <div className="text-[10px] text-slate-400 mt-0.5">RBI CSF, SEBI CSCRF, DPDP ACT</div>
          </div>
          <div className="p-2">
            <div className="text-xl font-bold text-emerald-400 glow-green">&lt; 1.0s SOLVER</div>
            <div className="text-[10px] text-slate-400 mt-0.5">5,000 RUN MONTE CARLO + KNAPSACK</div>
          </div>
        </div>
      </section>

      {/* Problem & Solution: Sleek Terminal Diff Matrix (Not Text Heavy!) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto font-mono">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold">
            // PARADIGM_SHIFT
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Subjective Heatmaps vs. Financial Quantification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Old Way */}
          <div className="p-4 rounded bg-[#0b0406] border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>TRADITIONAL (SUBJECTIVE AUDITS)</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#050203] border border-rose-900/40">
                <span className="text-rose-400 font-bold block mb-0.5">1. Color-Coded Guesswork</span>
                <span className="text-slate-400 text-[11px]">"VPN Gateway is HIGH / RED" — zero monetary impact defined for the board.</span>
              </div>
              <div className="p-2.5 rounded bg-[#050203] border border-rose-900/40">
                <span className="text-rose-400 font-bold block mb-0.5">2. Fear-Based Security Spend</span>
                <span className="text-slate-400 text-[11px]">Budgets granted on vendor hype rather than quantifiable rupee return.</span>
              </div>
              <div className="p-2.5 rounded bg-[#050203] border border-rose-900/40">
                <span className="text-rose-400 font-bold block mb-0.5">3. Static Annual Audits</span>
                <span className="text-slate-400 text-[11px]">Outdated compliance binder that sits on a shelf until the next audit.</span>
              </div>
            </div>
          </div>

          {/* New Way */}
          <div className="p-4 rounded bg-[#030e0b] border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-3">
              <Check className="w-4 h-4" />
              <span>ARTHARISK (RUPEE RIGOR)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#020806] border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-0.5">1. Rupee-Denominated Exposure</span>
                <span className="text-slate-300 text-[11px]">"Fortinet SSL-VPN presents <strong className="text-emerald-300">₹1.28 Cr EAL</strong> with a ₹18.5 Cr max breach loss."</span>
              </div>
              <div className="p-2.5 rounded bg-[#020806] border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-0.5">2. 0/1 Knapsack Optimization</span>
                <span className="text-slate-300 text-[11px]">Allocate ₹1.00 Cr budget to the exact controls cutting <strong className="text-emerald-300">₹3.82 Cr</strong> in risk (282% ROSI).</span>
              </div>
              <div className="p-2.5 rounded bg-[#020806] border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-0.5">3. Continuous Live Telemetry</span>
                <span className="text-slate-300 text-[11px]">Recalculates risk every time new CVEs or anomalous logins occur.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Operational Pipeline */}
      <section id="pipeline" className="py-14 px-4 md:px-8 border-t border-emerald-500/25 bg-[#030907] font-mono">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold">
              // ARCHITECTURE_PIPELINE
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              From SIEM Telemetry to Boardroom Capital
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div className="p-4 rounded bg-[#020705] border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center justify-between">
                <span>01. INGEST</span>
                <span className="text-[10px] text-slate-500">[7 FEEDS]</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Streams live CVEs, EPSS exploit likelihoods, active IAM privileges & EDR agent telemetry.
              </p>
            </div>

            <div className="p-4 rounded bg-[#020705] border border-cyan-500/30">
              <div className="text-xs font-bold text-cyan-400 mb-1 flex items-center justify-between">
                <span>02. QUANTIFY</span>
                <span className="text-[10px] text-slate-500">[₹ FORMULA]</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Multiplies likelihood P by monetary impact (Downtime + Breach + DPDP Regs + Reputation).
              </p>
            </div>

            <div className="p-4 rounded bg-[#020705] border border-violet-500/30">
              <div className="text-xs font-bold text-violet-400 mb-1 flex items-center justify-between">
                <span>03. SIMULATE</span>
                <span className="text-[10px] text-slate-500">[MONTE CARLO]</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Runs 5,000 iterations to calculate 95% tail VaR and test "What-If" remediation parameters.
              </p>
            </div>

            <div className="p-4 rounded bg-[#020705] border border-amber-500/30">
              <div className="text-xs font-bold text-amber-400 mb-1 flex items-center justify-between">
                <span>04. OPTIMIZE</span>
                <span className="text-[10px] text-slate-500">[KNAPSACK]</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Mathematical 0/1 knapsack algorithm selects maximum risk-reduction controls under fixed budget.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6 Capabilities Grid (Compact Cyber HUD Cards) */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto font-mono">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold">
            // CAPABILITY_SUITE
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Engineered for CISOs & Security Analysts
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div className="p-4 rounded bg-[#040f0c] border border-emerald-500/30 hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>RISK QUANT ENGINE</span>
              </span>
              <span className="text-[9px] px-1 rounded bg-emerald-950 border border-emerald-500/40">ONLINE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Derives per-asset likelihoods using CVSS + EPSS feeds mapped against 48 production assets.
            </p>
          </div>

          <div className="p-4 rounded bg-[#040f0c] border border-cyan-500/30 hover:border-cyan-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>WHAT-IF SCENARIOS</span>
              </span>
              <span className="text-[9px] px-1 rounded bg-cyan-950 border border-cyan-500/40">SIMULATOR</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live sliders test the financial payoff of 100% MFA rollout or shortening patch SLAs.
            </p>
          </div>

          <div className="p-4 rounded bg-[#040f0c] border border-emerald-500/30 hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>0/1 KNAPSACK OPTIMIZER</span>
              </span>
              <span className="text-[9px] px-1 rounded bg-emerald-950 border border-emerald-500/40">SOLVER</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Calculates the diminishing returns knee-point and recommends highest-ROSI projects.
            </p>
          </div>

          <div className="p-4 rounded bg-[#040f0c] border border-amber-500/30 hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>REGULATORY MAPPING</span>
              </span>
              <span className="text-[9px] px-1 rounded bg-amber-950 border border-amber-500/40">5 SCHEMAS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct linkage to RBI CSF, SEBI CSCRF, DPDP Act 2023 penalties & control mandates.
            </p>
          </div>

          <div className="p-4 rounded bg-[#040f0c] border border-cyan-500/30 hover:border-cyan-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>AI COPILOT</span>
              </span>
              <span className="text-[9px] px-1 rounded bg-cyan-950 border border-cyan-500/40">GEMINI_PRO</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded natural-language Q&A explaining key risk drivers and remediation priorities.
            </p>
          </div>

          <div className="p-4 rounded bg-[#040f0c] border border-emerald-500/30 hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>BOARDROOM REPORT</span>
              </span>
              <span className="text-[9px] px-1 rounded bg-emerald-950 border border-emerald-500/40">1-CLICK</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Exports executive memos with financial exposure, appetite alignment, and capital plan.
            </p>
          </div>

        </div>
      </section>

      {/* Regulatory Framework Pills */}
      <section className="py-8 px-4 md:px-8 border-t border-emerald-500/20 bg-[#020705] font-mono">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px] mr-2">COMPLIANCE_STANDARDS:</span>
          {['RBI_CSF', 'SEBI_CSCRF', 'DPDP_ACT_2023', 'NIST_CSF_2.0', 'ISO_27001_2022', 'CIS_CONTROLS_V8'].map((fw) => (
            <span key={fw} className="px-2.5 py-1 rounded bg-[#04120e] border border-emerald-500/30 text-emerald-300 text-[10px]">
              [{fw}]
            </span>
          ))}
        </div>
      </section>

      {/* Cyber Footer */}
      <footer className="border-t border-emerald-500/25 py-6 px-4 md:px-8 font-mono text-xs text-slate-500 bg-[#010403]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">ARTHARISK</span>
            <span>·</span>
            <span className="text-slate-400">Smart India Hackathon Prototype</span>
          </div>
          <button
            onClick={onLaunchDemo}
            className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            ❯ ENTER MISSION DASHBOARD
          </button>
        </div>
      </footer>

    </div>
  );
}
