import { useState } from 'react';
import { 
  CalculatedAsset, 
  EnterpriseRiskMetrics, 
  formatRupees, 
  quantifyEnterpriseRisk 
} from '../lib/riskEngine';
import { processNaturalLanguageQuery, NLQueryResponse } from '../lib/nlQuery';
import { CANDIDATE_PROJECTS } from '../data/mockData';
import { ScenarioParams } from '../types';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Bot, 
  Send, 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  Zap, 
  AlertCircle 
} from 'lucide-react';

interface DecisionSupportPageProps {
  metrics: EnterpriseRiskMetrics;
  assets: CalculatedAsset[];
  rawAssets: any[];
  onSelectAsset: (asset: CalculatedAsset) => void;
  onNavigateTab: (tabId: string) => void;
}

export function DecisionSupportPage({
  metrics,
  assets,
  rawAssets,
  onSelectAsset,
  onNavigateTab,
}: DecisionSupportPageProps) {
  // Scenario Parameters State
  const defaultScenario: ScenarioParams = {
    mfaPrivilegedPercent: 45, // default baseline
    criticalPatchRatePercent: 55,
    networkSegmentationPercent: 40,
    edrCoveragePercent: 70,
    remediationDelayDays: 0,
  };

  const [scenario, setScenario] = useState<ScenarioParams>(defaultScenario);

  // Compute what-if metrics dynamically with the scenario params
  const whatIfResult = quantifyEnterpriseRisk(rawAssets, scenario);
  const whatIfMetrics = whatIfResult.metrics;

  const ealDelta = whatIfMetrics.totalEal - metrics.totalEal;
  const isReduction = ealDelta <= 0;

  // Natural Language Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; content: string; response?: NLQueryResponse }>>([
    {
      sender: 'ai',
      content: `Hello! I am **CyberQuant AI Copilot**. I analyze continuous telemetry from your 7 security feeds and evaluate monetary risk across all 45 enterprise assets. Ask me anything or select a prompt below:`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  // Suggested Prompts
  const suggestedPrompts = [
    'What is our highest financial cyber risk today?',
    'Which vulnerabilities contribute most to our expected losses?',
    'What if we implement MFA on all privileged accounts?',
    'Show top 5 assets by expected loss',
    'How does delaying remediation by 30 days change exposure?',
  ];

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isQuerying) return;
    const userQ = queryText.trim();
    setInputQuery('');

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', content: userQ }]);
    setIsQuerying(true);

    try {
      const response = await processNaturalLanguageQuery(userQ, metrics, assets);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', content: response.answer, response },
      ]);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          content: 'Unable to process query at this moment. Please try again.',
        },
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  // 90-Day Predictive Forecast Chart Data (Simulated Gradient-Boosted Model)
  const forecastData = [
    { day: 'Day 0', p50: Number((metrics.totalEal / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 0.95) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.05) / 10000000).toFixed(2)) },
    { day: 'Day 15', p50: Number(((metrics.totalEal * 1.04) / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 0.96) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.12) / 10000000).toFixed(2)) },
    { day: 'Day 30', p50: Number(((metrics.totalEal * 1.11) / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 0.98) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.25) / 10000000).toFixed(2)) },
    { day: 'Day 45', p50: Number(((metrics.totalEal * 1.18) / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 1.01) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.38) / 10000000).toFixed(2)) },
    { day: 'Day 60', p50: Number(((metrics.totalEal * 1.24) / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 1.05) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.49) / 10000000).toFixed(2)) },
    { day: 'Day 75', p50: Number(((metrics.totalEal * 1.31) / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 1.08) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.62) / 10000000).toFixed(2)) },
    { day: 'Day 90', p50: Number(((metrics.totalEal * 1.39) / 10000000).toFixed(2)), p10: Number(((metrics.totalEal * 1.12) / 10000000).toFixed(2)), p90: Number(((metrics.totalEal * 1.76) / 10000000).toFixed(2)) },
  ];

  // Waterfall delta data for What-If
  const waterfallData = [
    { name: 'Baseline EAL', amount: Math.round(metrics.totalEal / 100000), fill: '#64748B' },
    { 
      name: 'MFA Impact', 
      amount: Math.round(((scenario.mfaPrivilegedPercent - 45) / 55) * -142), 
      fill: scenario.mfaPrivilegedPercent >= 45 ? '#00E5FF' : '#FF1744' 
    },
    { 
      name: 'Patching SLA', 
      amount: Math.round(((scenario.criticalPatchRatePercent - 55) / 45) * -89), 
      fill: scenario.criticalPatchRatePercent >= 55 ? '#7C4DFF' : '#FF1744' 
    },
    { 
      name: 'Segmentation', 
      amount: Math.round(((scenario.networkSegmentationPercent - 40) / 60) * -110), 
      fill: scenario.networkSegmentationPercent >= 40 ? '#00E676' : '#FF1744' 
    },
    { 
      name: 'Delay Penalty', 
      amount: Math.round((scenario.remediationDelayDays / 30) * 85), 
      fill: '#FFB300' 
    },
    { name: 'Simulated EAL', amount: Math.round(whatIfMetrics.totalEal / 100000), fill: '#00E5FF' },
  ];

  // Apply a recommendation directly to the simulation
  const handleApplyRecToSim = (type: string) => {
    if (type === 'mfa') {
      setScenario((prev) => ({ ...prev, mfaPrivilegedPercent: 100 }));
    } else if (type === 'patch') {
      setScenario((prev) => ({ ...prev, criticalPatchRatePercent: 100 }));
    } else if (type === 'segment') {
      setScenario((prev) => ({ ...prev, networkSegmentationPercent: 95 }));
    } else if (type === 'edr') {
      setScenario((prev) => ({ ...prev, edrCoveragePercent: 100 }));
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>AI Decision Intelligence</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400 font-mono">Predictive Modeling & What-If Lab</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Predictive Analytics, Copilot & Scenario Lab
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Simulate enterprise security investments before committing capital. Query natural language telemetry and forecast 90-day exposure trends.
        </p>
      </div>

      {/* Top Split: Natural Language Copilot + 90-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Natural Language Query Interface (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">CyberQuant AI Copilot</h2>
                  <span className="text-[10px] text-slate-400 font-mono">Model: Gemini 3.8 Flash + Deterministic Quant</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                Online & Grounded
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="mt-3 overflow-y-auto max-h-[300px] space-y-3 pr-1 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 ml-8'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 mr-4'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                  {/* Highlights if present */}
                  {m.response?.metricsHighlight && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800 font-mono">
                      {m.response.metricsHighlight.map((h, hIdx) => (
                        <div key={hIdx} className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{h.label}</span>
                          <span className="text-xs font-bold text-cyan-300 block">{h.value}</span>
                          {h.sublabel && <span className="text-[9px] text-slate-400 block">{h.sublabel}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Table data if present */}
                  {m.response?.tableData && (
                    <div className="overflow-x-auto mt-3 rounded-lg border border-slate-800">
                      <table className="w-full text-left font-mono text-[10px]">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                          <tr>
                            {m.response.tableData.headers.map((hd, i) => (
                              <th key={i} className="py-1.5 px-2">{hd}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {m.response.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="py-1.5 px-2 text-slate-300">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Action button if present */}
                  {m.response?.suggestedAction && (
                    <div className="mt-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          if (m.response?.suggestedAction?.actionType === 'open-whatif') {
                            // Focus on what if
                          } else if (m.response?.suggestedAction?.actionType === 'open-optimizer') {
                            onNavigateTab('optimization');
                          }
                        }}
                        className="text-[11px] text-cyan-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>{m.response.suggestedAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isQuerying && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Synthesizing continuous telemetry & computing financial impact...</span>
                </div>
              )}
            </div>
          </div>

          {/* Input & Suggested Chips */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            {/* Suggested Chips */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {suggestedPrompts.slice(0, 3).map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendQuery(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors truncate max-w-[280px] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(inputQuery)}
                placeholder="Ask about assets, CVE financial impact, or mitigation scenarios..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => handleSendQuery(inputQuery)}
                disabled={isQuerying || !inputQuery.trim()}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 90-Day Predictive Forecast Chart (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-xs font-bold text-white">90-Day Exposure Forecast</h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  Model: Gradient-boosted trend model (simulated)
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                P10 - P90 Band
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              If remediation velocity remains at status quo, unpatched CVEs and evolving threat actor weaponization are projected to increase EAL from <strong className="text-cyan-300 font-mono">{formatRupees(metrics.totalEal)}</strong> to <strong className="text-rose-400 font-mono">{formatRupees(metrics.totalEal * 1.39)}</strong> over 90 days.
            </p>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="p90Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF1744" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF1744" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#091026', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [`₹${val} Cr`, name]}
                  />
                  <Area type="monotone" dataKey="p90" stroke="#FF1744" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#p90Grad)" name="P90 Worst Case" />
                  <Area type="monotone" dataKey="p50" stroke="#00E5FF" strokeWidth={2.5} fillOpacity={0} name="P50 Expected Trend" />
                  <Area type="monotone" dataKey="p10" stroke="#00E676" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={0} name="P10 Best Case" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Expected (P50)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Upper Tail (P90)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Best Case (P10)
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Simulator ("What-If Lab") */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Scenario Simulator ("What-If Lab")</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Modify operational controls and observe instantaneous recalculation of Expected Annual Loss and Risk Score.
            </p>
          </div>

          <button
            onClick={() => setScenario(defaultScenario)}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Slider 1: MFA */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Privileged MFA Adoption</span>
              <span className="font-mono font-bold text-cyan-400">{scenario.mfaPrivilegedPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={scenario.mfaPrivilegedPercent}
              onChange={(e) => setScenario({ ...scenario, mfaPrivilegedPercent: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Target: 100% on 4,200 admin accounts</span>
          </div>

          {/* Slider 2: Patch SLA */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Critical Patch SLA</span>
              <span className="font-mono font-bold text-violet-400">{scenario.criticalPatchRatePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={scenario.criticalPatchRatePercent}
              onChange={(e) => setScenario({ ...scenario, criticalPatchRatePercent: Number(e.target.value) })}
              className="w-full accent-violet-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 block mt-1">SLA &lt; 7 days for CISA KEV CVEs</span>
          </div>

          {/* Slider 3: Network Segmentation */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">VLAN Microsegmentation</span>
              <span className="font-mono font-bold text-emerald-400">{scenario.networkSegmentationPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={scenario.networkSegmentationPercent}
              onChange={(e) => setScenario({ ...scenario, networkSegmentationPercent: Number(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Isolates UPI & Trading networks</span>
          </div>

          {/* Slider 4: EDR Coverage */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">EDR Sensor Coverage</span>
              <span className="font-mono font-bold text-sky-400">{scenario.edrCoveragePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={scenario.edrCoveragePercent}
              onChange={(e) => setScenario({ ...scenario, edrCoveragePercent: Number(e.target.value) })}
              className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 block mt-1">CrowdStrike Falcon on endpoints</span>
          </div>

          {/* Slider 5: Remediation Delay */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Remediation Delay</span>
              <span className="font-mono font-bold text-amber-400">{scenario.remediationDelayDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={scenario.remediationDelayDays}
              onChange={(e) => setScenario({ ...scenario, remediationDelayDays: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Simulates deferring critical fixes</span>
          </div>
        </div>

        {/* Before vs After Comparison Card */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Baseline Exposure (EAL)</span>
              <span className="text-lg font-bold font-mono text-slate-300">{formatRupees(metrics.totalEal)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Simulated Post-Scenario EAL</span>
              <span className={`text-lg font-bold font-mono ${isReduction ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatRupees(whatIfMetrics.totalEal)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Net Risk Delta</span>
              <span className={`text-lg font-bold font-mono ${isReduction ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isReduction ? `-${formatRupees(Math.abs(ealDelta))}` : `+${formatRupees(ealDelta)}`}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              ({((Math.abs(ealDelta) / metrics.totalEal) * 100).toFixed(1)}% shift)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Risk Score Shift</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-mono text-slate-400">{metrics.enterpriseRiskScore}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className={`text-lg font-bold font-mono ${whatIfMetrics.enterpriseRiskScore < metrics.enterpriseRiskScore ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {whatIfMetrics.enterpriseRiskScore} / 100
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {whatIfMetrics.enterpriseRiskScore <= 60 ? 'Within Tolerance' : 'Exceeds Tolerance'}
            </span>
          </div>
        </div>

        {/* Risk Reduction Waterfall Bar */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Waterfall Impact by Security Control Parameter (₹ in Lakhs)
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091026', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${val} Lakh`, 'Exposure / Delta']}
                />
                <Bar dataKey="amount" fill="#00E5FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Mitigation Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Prioritized Mitigation Initiatives (Ranked by ROSI)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click "Apply to Simulation" to instantly project financial impact on the What-If lab above
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('optimization')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Solve for Fixed Budget in Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CANDIDATE_PROJECTS.slice(0, 4).map((p, idx) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">{p.category}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">+{p.rosi.toFixed(0)}% ROSI</span>
                </div>
                <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{p.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Cost:</span>
                  <span className="text-slate-200">{formatRupees(p.cost)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Risk Reduction:</span>
                  <span className="text-emerald-400 font-semibold">{formatRupees(p.riskReduction)}</span>
                </div>
                <button
                  onClick={() => {
                    if (idx === 0) handleApplyRecToSim('mfa');
                    else if (idx === 1) handleApplyRecToSim('patch');
                    else if (idx === 2) handleApplyRecToSim('segment');
                    else handleApplyRecToSim('edr');
                  }}
                  className="w-full mt-2 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Apply to Simulation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
