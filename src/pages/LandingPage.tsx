import { useState, useEffect } from 'react';
import { formatRupees, EnterpriseRiskMetrics } from '../lib/riskEngine';
import { 
  Shield, 
  ArrowRight, 
  Cpu, 
  Sliders, 
  Layers, 
  Lock, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Terminal,
  Activity,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDemo: () => void;
  metrics: EnterpriseRiskMetrics;
}

export function LandingPage({ onLaunchDemo, metrics }: LandingPageProps) {
  // Sparkline data
  const sparklinePoints = [62, 58, 65, 71, 68, 74, 82, 79, 85, 76, 72];

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 md:px-8 overflow-hidden cyber-grid-bg">
        {/* Glow ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>Smart India Hackathon Prototype · Continuous Quant Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Cyber Risk, Quantified in <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">Rupees.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Replace subjective "High/Medium/Low" ratings with continuous financial exposure metrics. Quantify Expected Annual Loss, simulate threat vectors, and optimize security capital allocation under a fixed budget.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLaunchDemo}
                className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <span>Launch Live Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-xl transition-colors text-center"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Hero Live Widget */}
          <div className="mt-14 max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl glass-panel glass-panel-hover shadow-2xl relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Activity className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono">ENTERPRISE FINANCIAL EXPOSURE</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                    {formatRupees(metrics.totalEal)}
                    <span className="text-xs text-slate-400 font-sans font-normal ml-2">Expected Annual Loss</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-right font-mono text-xs">
                <span className="text-slate-400 block text-[11px]">95% Value at Risk (VaR)</span>
                <span className="text-rose-400 font-bold text-sm tabular-nums">
                  {formatRupees(metrics.totalEal * 2.85)}
                </span>
              </div>
            </div>

            {/* Sparkline & details */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 flex items-center gap-1 font-medium">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Over Appetite by {formatRupees(Math.max(0, metrics.totalEal - metrics.riskAppetiteLimit))}
                </span>
                <span aria-hidden="true">·</span>
                <span>Risk Appetite: {formatRupees(metrics.riskAppetiteLimit)}</span>
              </div>

              {/* Mini Sparkline Visualization */}
              <div className="flex items-end gap-1.5 h-6">
                {sparklinePoints.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-t transition-all ${
                      idx === sparklinePoints.length - 1 ? 'bg-cyan-400 h-6' : 'bg-slate-700 h-3'
                    }`}
                    style={{ height: `${(val / 90) * 24}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-400">7 Connectors</div>
            <div className="text-xs text-slate-400 mt-1">SIEM, IAM, EDR, CSPM, Vuln Mgmt</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-violet-400">5 Frameworks</div>
            <div className="text-xs text-slate-400 mt-1">RBI CSF, SEBI CSCRF, DPDP Act, NIST</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">&lt; 1 Second</div>
            <div className="text-xs text-slate-400 mt-1">5,000 Iteration Monte Carlo Sim</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">+215% ROSI</div>
            <div className="text-xs text-slate-400 mt-1">Risk Reduction per Budget Rupee</div>
          </div>
        </div>
      </section>

      {/* The Problem: Old Way vs New Way */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            The Fundamental Problem
          </span>
          <h2 className="text-3xl font-bold text-white mt-2">
            Why Traditional Cyber Risk Management Fails Boards
          </h2>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            CISOs communicate technical CVE scores, while Boards approve financial balance sheets. This language barrier leads to misallocated cybersecurity capital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 relative">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>The Old Way (Subjective Heatmaps)</span>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-900/30">
                <span className="font-semibold text-rose-300 block mb-1">Color-Coded Ambiguity:</span>
                "VPN Gateway is <span className="text-rose-400 font-bold">RED / HIGH</span>" — but how much will a breach cost the business? Nobody knows.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-900/30">
                <span className="font-semibold text-rose-300 block mb-1">Guesswork Budgeting:</span>
                Security tools bought on fear and vendor marketing rather than quantifiable return on investment.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-900/30">
                <span className="font-semibold text-rose-300 block mb-1">Stale Annual Audits:</span>
                Static compliance checklists that fall out of date within 48 hours of assessment.
              </div>
            </div>
          </div>

          {/* New Way */}
          <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 relative">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>The CyberQuant AI Way (Financial Precision)</span>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40">
                <span className="font-semibold text-cyan-300 block mb-1">Rupee-Denominated Exposure:</span>
                "Fortinet SSL-VPN Gateway presents **₹1.28 Cr Expected Annual Loss**; single breach potential is ₹18.5 Cr."
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40">
                <span className="font-semibold text-cyan-300 block mb-1">0/1 Knapsack Optimization:</span>
                Allocate exactly ₹1.00 Cr budget to the combination of controls that cuts ₹3.82 Cr in risk (282% ROSI).
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40">
                <span className="font-semibold text-cyan-300 block mb-1">Continuous Live Telemetry:</span>
                Recalculates risk every time a new CVE or anomalous authentication is ingested from SIEM/EDR.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              The 4-Step Pipeline
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              From Technical Telemetry to Boardroom Capital Decisions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Ingest & Correlate</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connects to vulnerability scanners, IAM, SIEM, and EDR, mapping 45+ assets with threat intelligence (CISA KEV, EPSS).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Quantify in Rupees</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Computes asset Likelihood P and Impact (Downtime + Breach + Regulatory + Reputational) using Monte Carlo simulation.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">AI Copilot Analysis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Natural-language Q&A powered by Gemini explains key risk drivers and answers complex "What-if" remediation queries.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                04
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Optimize Capital</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                0/1 Knapsack optimization solves for the mathematically optimal security plan under your budget envelope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (6 Cards) */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-bold text-white mt-2">
            Comprehensive Suite for CISO & Technical Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <Cpu className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Continuous Risk Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Computes EAL and VaR across 45+ assets. Incorporates CVSS severity, EPSS exploit likelihood, and active control defense deficits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/30 transition-colors">
            <Sliders className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Scenario "What-If" Simulator</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test the financial impact of rolling out 100% MFA, cutting patch SLAs, or segmenting payment VLANs before spending a single rupee.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
            <Layers className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">0/1 Knapsack Optimizer</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Identifies the diminishing returns knee point and recommends the highest-ROSI project combination under any budget slider constraint.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors">
            <Lock className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Compliance Financial Mapping</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Directly associates compliance gaps in RBI CSF, SEBI CSCRF, and DPDP Act with monetary penalty exposure and affected critical assets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/30 transition-colors">
            <Terminal className="w-6 h-6 text-sky-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">AI Copilot Natural Q&A</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask questions in plain English. Get data-grounded answers with inline calculation details, asset rankings, and actionable steps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-rose-500/30 transition-colors">
            <Award className="w-6 h-6 text-rose-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">One-Click Board Reporting</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Export executive board memos formatted with clear monetary exposure, risk appetite status, and prioritized mitigation budgets.
            </p>
          </div>
        </div>
      </section>

      {/* Frameworks & Integrations Strip */}
      <section className="py-16 px-4 md:px-8 border-t border-slate-800/80 bg-slate-950/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-xs text-slate-400 uppercase font-mono tracking-wider mb-8">
            Pre-Mapped Compliance Frameworks & Regulatory Circulars
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-300">
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              RBI Cyber Security Framework
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              SEBI CSCRF Guidelines
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              India DPDP Act 2023
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              NIST Cybersecurity Framework 2.0
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              ISO/IEC 27001:2022
            </span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              CIS Critical Controls v8
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">CyberQuant AI</span>
            <span>· Built for Smart India Hackathon</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Theme: Cybersecurity & Defense Intelligence</span>
            <button onClick={onLaunchDemo} className="text-cyan-400 hover:underline cursor-pointer">
              Launch Platform →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
