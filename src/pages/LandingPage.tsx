import { useState, useEffect } from 'react';
import { formatRupees, EnterpriseRiskMetrics } from '../lib/riskEngine';
import { 
  ArrowRight, 
  Cpu, 
  Sliders, 
  Layers, 
  Lock, 
  Activity, 
  Flame, 
  Radio, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDemo: () => void;
  metrics: EnterpriseRiskMetrics;
}

export function LandingPage({ onLaunchDemo, metrics }: LandingPageProps) {
  const sparklineBars = [35, 42, 50, 48, 62, 58, 70, 65, 84, 92, 78, 88];

  return (
    <div className="min-h-screen bg-[#020508] text-slate-200 cyber-grid-bg selection:bg-emerald-500/30 selection:text-emerald-300 font-mono">
      
      {/* Top Cyber Command Bar */}
      <div className="w-full bg-[#030a08] border-b border-emerald-500/25 px-4 py-1.5 flex items-center justify-between text-[11px] text-emerald-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold tracking-wider">[SYS: ONLINE]</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">FEEDS: 7/7 ACTIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>LATENCY: 42ms</span>
          <span className="text-slate-600">|</span>
          <span>TARGET: AARAV_FINSERVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">[GRID: SECURE]</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-10 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#041410] border border-emerald-500/40 text-emerald-400 text-xs mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider">SMART INDIA HACKATHON · CYBER DEFENSE AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            CYBER RISK, <span className="text-emerald-400 glow-green">QUANTIFIED</span> IN <span className="text-cyan-400 glow-cyan">₹ RUPEES.</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Monetary risk quantification & 0/1 Knapsack capital optimization for Indian enterprises.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
              ❯ PIPELINE TOPOLOGY
            </a>
          </div>
        </div>

        {/* Live Terminal Telemetry Widget */}
        <div className="mt-8 max-w-3xl mx-auto terminal-card rounded border border-emerald-500/40 overflow-hidden shadow-2xl">
          <div className="bg-[#030907] px-4 py-2 border-b border-emerald-500/30 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="text-slate-500 font-semibold ml-2">root@artharisk-engine:~#</span>
              <span className="text-emerald-400">run-risk-eval --target aarav-finserve</span>
            </div>
            <span className="text-emerald-400 font-semibold text-[10px]">[LIVE_STREAM]</span>
          </div>

          <div className="p-4 sm:p-5 bg-[#040f0c]/90">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3 border-b border-emerald-500/20">
              
              <div className="p-2.5 rounded bg-[#020806] border border-emerald-500/30">
                <span className="text-[9px] text-slate-500 block">EXPECTED ANNUAL LOSS</span>
                <div className="text-lg sm:text-2xl font-black text-emerald-400 glow-green tabular-nums mt-0.5">
                  {formatRupees(metrics.totalEal)}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#020806] border border-rose-500/30">
                <span className="text-[9px] text-slate-500 block">95% VALUE AT RISK (VaR)</span>
                <div className="text-lg sm:text-2xl font-black text-rose-400 glow-red tabular-nums mt-0.5">
                  {formatRupees(metrics.totalEal * 2.85)}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#020806] border border-amber-500/30">
                <span className="text-[9px] text-slate-500 block">APPETITE EXCESS</span>
                <div className="text-lg sm:text-2xl font-black text-amber-400 glow-amber tabular-nums mt-0.5">
                  +{formatRupees(Math.max(0, metrics.totalEal - metrics.riskAppetiteLimit))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#020806] border border-cyan-500/30">
                <span className="text-[9px] text-slate-500 block">OPTIMAL ROSI</span>
                <div className="text-lg sm:text-2xl font-black text-cyan-400 glow-cyan tabular-nums mt-0.5">
                  +282%
                </div>
              </div>

            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-rose-300 bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 rounded text-[11px]">
                <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>TOP VECTOR: Fortinet SSL-VPN (CVE-2024-21762 - 84% Exploit Prob)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">TRAJECTORY:</span>
                <div className="flex items-end gap-1 h-4">
                  {sparklineBars.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-t ${
                        idx === sparklineBars.length - 1 ? 'bg-emerald-400 h-4' : 'bg-emerald-800/60 h-2'
                      }`}
                      style={{ height: `${(val / 100) * 16}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cyber Telemetry Stats Strip */}
      <section className="border-y border-emerald-500/25 bg-[#030907] py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-1">
            <div className="text-lg font-bold text-emerald-400 glow-green">07 PIPELINES</div>
            <div className="text-[10px] text-slate-500">SIEM, IAM, EDR, CSPM, VULNS</div>
          </div>
          <div className="p-1">
            <div className="text-lg font-bold text-cyan-400 glow-cyan">48 ASSETS</div>
            <div className="text-[10px] text-slate-500">CONTINUOUS FINANCIAL TRACKING</div>
          </div>
          <div className="p-1">
            <div className="text-lg font-bold text-amber-400 glow-amber">05 FRAMEWORKS</div>
            <div className="text-[10px] text-slate-500">RBI CSF, SEBI CSCRF, DPDP ACT</div>
          </div>
          <div className="p-1">
            <div className="text-lg font-bold text-emerald-400 glow-green">&lt; 1.0s SOLVER</div>
            <div className="text-[10px] text-slate-500">5k MONTE CARLO + 0/1 KNAPSACK</div>
          </div>
        </div>
      </section>

      {/* Problem & Solution: Sleek Comparison Matrix */}
      <section className="py-10 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <span className="text-[10px] text-emerald-400 tracking-widest font-bold">// PARADIGM_SHIFT</span>
          <h2 className="text-xl font-bold text-white mt-0.5">Subjective Heatmaps vs. Financial Quantification</h2>
        </div>

        <div className="overflow-x-auto rounded border border-emerald-500/25 bg-[#030907]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-500/20 text-left bg-[#020504]">
                <th className="py-2.5 px-3 text-slate-400 font-bold uppercase w-1/4">DIMENSION</th>
                <th className="py-2.5 px-3 text-rose-400 font-bold uppercase w-3/8">TRADITIONAL METHOD</th>
                <th className="py-2.5 px-3 text-emerald-400 font-bold uppercase w-3/8">ARTHARISK METHOD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-400">Risk Assessment</td>
                <td className="py-2.5 px-3 text-rose-300/80">"High / Medium / Low" color tags (zero ₹ clarity)</td>
                <td className="py-2.5 px-3 text-emerald-300 font-bold">₹4.82 Cr EAL + ₹13.74 Cr 95% Tail VaR</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-400">Capital Allocation</td>
                <td className="py-2.5 px-3 text-rose-300/80">Fear-driven purchases & vendor marketing</td>
                <td className="py-2.5 px-3 text-emerald-300 font-bold">0/1 Knapsack optimal spend frontier (282% ROSI)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-400">Audit & Sync</td>
                <td className="py-2.5 px-3 text-rose-300/80">Annual static PDF checklist (outdated in 48h)</td>
                <td className="py-2.5 px-3 text-emerald-300 font-bold">Continuous live feeds (SIEM, IAM, EDR, Threat Feeds)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4-Step Pipeline: Visual Compact Circuit */}
      <section id="pipeline" className="py-10 px-4 md:px-8 border-t border-emerald-500/20 bg-[#030907]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[10px] text-emerald-400 tracking-widest font-bold">// ARCHITECTURE_PIPELINE</span>
            <h2 className="text-xl font-bold text-white mt-0.5">End-to-End Execution Flow</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 rounded bg-[#020705] border border-emerald-500/30">
              <span className="text-xs font-bold text-emerald-400 block mb-1">01. INGEST</span>
              <span className="text-[10px] text-slate-400">SIEM, IAM, EDR & Threat Feeds</span>
            </div>
            <div className="p-3 rounded bg-[#020705] border border-cyan-500/30">
              <span className="text-xs font-bold text-cyan-400 block mb-1">02. QUANTIFY</span>
              <span className="text-[10px] text-slate-400">Likelihood P × Monetary Loss Impact</span>
            </div>
            <div className="p-3 rounded bg-[#020705] border border-violet-500/30">
              <span className="text-xs font-bold text-violet-400 block mb-1">03. SIMULATE</span>
              <span className="text-[10px] text-slate-400">5k Monte Carlo Runs + What-If Lab</span>
            </div>
            <div className="p-3 rounded bg-[#020705] border border-amber-500/30">
              <span className="text-xs font-bold text-amber-400 block mb-1">04. OPTIMIZE</span>
              <span className="text-[10px] text-slate-400">0/1 Knapsack Maximum ROSI Plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Console HUD */}
      <section className="py-10 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <span className="text-[10px] text-emerald-400 tracking-widest font-bold">// CONSOLE_DIRECT_DISPATCH</span>
          <h2 className="text-xl font-bold text-white mt-0.5">Immediate Mission Access</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <button
            onClick={onLaunchDemo}
            className="p-3 rounded bg-[#030907] border border-emerald-500/30 hover:border-emerald-400 text-left transition-all cursor-pointer group"
          >
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">// BOARD_ROOM</span>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">Executive CISO</span>
            <span className="text-[9px] text-slate-500 block mt-1">EAL & 95% VaR</span>
          </button>

          <button
            onClick={onLaunchDemo}
            className="p-3 rounded bg-[#030907] border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group"
          >
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">// RISK_ENGINE</span>
            <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">48 Assets</span>
            <span className="text-[9px] text-slate-500 block mt-1">EPSS/CVSS Drilldown</span>
          </button>

          <button
            onClick={onLaunchDemo}
            className="p-3 rounded bg-[#030907] border border-emerald-500/30 hover:border-emerald-400 text-left transition-all cursor-pointer group"
          >
            <span className="text-[10px] text-emerald-400 font-bold block mb-1">// SCENARIO_LAB</span>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">What-If Lab</span>
            <span className="text-[9px] text-slate-500 block mt-1">MFA & SLA Sliders</span>
          </button>

          <button
            onClick={onLaunchDemo}
            className="p-3 rounded bg-[#030907] border border-amber-500/30 hover:border-amber-400 text-left transition-all cursor-pointer group"
          >
            <span className="text-[10px] text-amber-400 font-bold block mb-1">// OPTIMIZER</span>
            <span className="text-xs font-bold text-white group-hover:text-amber-300 block">Knapsack Solver</span>
            <span className="text-[9px] text-slate-500 block mt-1">₹1 Cr Budget Knee</span>
          </button>

          <button
            onClick={onLaunchDemo}
            className="p-3 rounded bg-[#030907] border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group col-span-2 md:col-span-1"
          >
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">// COMPLIANCE</span>
            <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">Audit Mapper</span>
            <span className="text-[9px] text-slate-500 block mt-1">RBI & SEBI CSCRF</span>
          </button>
        </div>
      </section>

      {/* Compliance Standard Badges */}
      <section className="py-6 px-4 border-t border-emerald-500/20 bg-[#020705]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 text-[10px] mr-2 font-bold">FRAMEWORKS:</span>
          {['RBI_CSF', 'SEBI_CSCRF', 'DPDP_ACT_2023', 'NIST_CSF_2.0', 'ISO_27001_2022', 'CIS_CONTROLS_V8'].map((fw) => (
            <span key={fw} className="px-2 py-0.5 rounded bg-[#04120e] border border-emerald-500/30 text-emerald-300 text-[10px]">
              [{fw}]
            </span>
          ))}
        </div>
      </section>

      {/* Cyber Footer */}
      <footer className="border-t border-emerald-500/25 py-4 px-4 md:px-8 text-xs text-slate-500 bg-[#010403]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">ARTHARISK</span>
            <span>·</span>
            <span className="text-slate-500">Smart India Hackathon Prototype</span>
          </div>
          <button
            onClick={onLaunchDemo}
            className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            ❯ ENTER CONSOLE
          </button>
        </div>
      </footer>

    </div>
  );
}
