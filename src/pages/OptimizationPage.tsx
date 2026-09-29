import { useState, useMemo } from 'react';
import { 
  EnterpriseRiskMetrics, 
  formatRupees 
} from '../lib/riskEngine';
import { 
  solveSecurityInvestmentKnapsack, 
  computePlanComparisons 
} from '../lib/optimizer';
import { CANDIDATE_PROJECTS } from '../data/mockData';
import { CandidateControlProject, OptimizationResult } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  ReferenceArea 
} from 'recharts';
import { 
  Layers, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  HelpCircle, 
  FileText 
} from 'lucide-react';

interface OptimizationPageProps {
  metrics: EnterpriseRiskMetrics;
  onOpenBoardReport: (result: OptimizationResult) => void;
}

export function OptimizationPage({
  metrics,
  onOpenBoardReport,
}: OptimizationPageProps) {
  // Budget slider state in INR (default ₹1.00 Cr = 10,000,000)
  const [budget, setBudget] = useState<number>(10000000);

  // Candidate projects list
  const [projects] = useState<CandidateControlProject[]>(CANDIDATE_PROJECTS);

  // Run 0/1 Knapsack optimization dynamically when budget changes
  const optimizationResult = useMemo(() => {
    return solveSecurityInvestmentKnapsack(projects, budget, metrics.totalEal);
  }, [projects, budget, metrics.totalEal]);

  // Compute 3-way plan comparison: Optimal vs Manual vs Do Nothing
  const comparisons = useMemo(() => {
    return computePlanComparisons(projects, optimizationResult, metrics.totalEal);
  }, [projects, optimizationResult, metrics.totalEal]);

  // Frontier chart data formatted for Recharts
  const chartCurveData = optimizationResult.frontierCurve.map((point) => ({
    budgetCr: Number((point.budget / 10000000).toFixed(2)),
    riskReductionCr: Number((point.riskReduction / 10000000).toFixed(2)),
    budgetRaw: point.budget,
    isOptimalKnee: point.isOptimalKnee,
  }));

  const currentBudgetCr = Number((budget / 10000000).toFixed(2));

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">[OPTIMIZER_SOLVER: CONVERGED]</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">0/1_KNAPSACK_ROSI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
            // CAPITAL_INVESTMENT_OPTIMIZATION
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Solves 0/1 knapsack combinatorial optimization for maximum rupee risk reduction under your budget constraint.
          </p>
        </div>

        <button
          onClick={() => onOpenBoardReport(optimizationResult)}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer transition-all"
        >
          <FileText className="w-4 h-4 text-slate-950" />
          <span>[EXPORT_BOARD_REPORT]</span>
        </button>
      </div>

      {/* Budget Slider Controller */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              // BUDGET_ALLOCATION_ENVELOPE
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Drag slider to re-solve 0/1 knapsack algorithm and compute residual financial exposure.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 glow-green tabular-nums">
              {formatRupees(budget)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {budget >= 10000000 ? `${(budget / 10000000).toFixed(2)} Crore Envelope` : `${(budget / 100000).toFixed(0)} Lakh Envelope`}
            </span>
          </div>
        </div>

        {/* The Slider */}
        <div className="pt-1">
          <input
            type="range"
            min="1000000" // ₹10 Lakh
            max="100000000" // ₹10 Crore
            step="1000000" // ₹10 Lakh steps
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#020504] rounded border border-emerald-500/20"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>₹10L MIN</span>
            <span className="text-emerald-400 font-bold">ACTIVE: {formatRupees(budget)}</span>
            <span>₹10.00 Cr MAX</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-500/20 text-xs">
          <span className="text-slate-500 text-[10px] uppercase font-semibold mr-1">PRESETS:</span>
          {[
            { label: '₹50 LAKH', value: 5000000 },
            { label: '₹1.00 CR (OPTIMAL)', value: 10000000 },
            { label: '₹2.00 CR', value: 20000000 },
            { label: '₹3.50 CR', value: 35000000 },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setBudget(preset.value)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                budget === preset.value
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                  : 'bg-[#020504] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Outcome KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded bg-[#030907] border border-emerald-500/25">
          <span className="text-[10px] text-slate-500 uppercase">[ALLOCATED_SPEND]</span>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 glow-green mt-1">
            {formatRupees(optimizationResult.totalCost)}
          </div>
          <span className="text-[9px] text-slate-500">
            {((optimizationResult.totalCost / budget) * 100).toFixed(0)}% budget utilized
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#030907] border border-emerald-500/25">
          <span className="text-[10px] text-slate-500 uppercase">[RISK_REDUCTION]</span>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 glow-green mt-1">
            {formatRupees(optimizationResult.totalRiskReduction)}
          </div>
          <span className="text-[9px] text-emerald-400/80">EAL compressed</span>
        </div>

        <div className="p-3.5 rounded bg-[#030907] border border-cyan-500/25">
          <span className="text-[10px] text-slate-500 uppercase">[RESIDUAL_EAL]</span>
          <div className="text-lg sm:text-xl font-black font-mono text-cyan-300 glow-cyan mt-1">
            {formatRupees(optimizationResult.residualEal)}
          </div>
          <span className="text-[9px] text-cyan-400">
            {metrics.totalEal > 0 ? `${((optimizationResult.totalRiskReduction / metrics.totalEal) * 100).toFixed(0)}% reduction achieved` : '0%'}
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#030907] border border-emerald-500/25">
          <span className="text-[10px] text-slate-500 uppercase">[PORTFOLIO_ROSI]</span>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 glow-green mt-1">
            +{optimizationResult.overallRosi}%
          </div>
          <span className="text-[9px] text-slate-500">Net rupee yield</span>
        </div>
      </div>

      {/* Diminishing Returns Frontier Curve */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-2 tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              // KNAPSACK_FRONTIER_CURVE [DIMINISHING RETURNS KNEE]
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Highlighting mathematically optimal investment zone before marginal returns decay
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Knapsack Curve
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Optimal Zone (₹1.20 Cr)
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartCurveData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <XAxis dataKey="budgetCr" stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020605', borderColor: '#10B981', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                formatter={(val: any) => [`₹${val} Cr Reduced`, 'Risk Reduction']}
                labelFormatter={(label) => `Budget: ₹${label} Cr`}
              />
              {/* Optimal Spend Zone Shaded Area */}
              <ReferenceArea x1={0.8} x2={1.6} strokeOpacity={0.3} fill="#10B981" fillOpacity={0.08} />
              {/* Current Budget Marker */}
              <ReferenceLine x={currentBudgetCr} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'ACTIVE_BUDGET', fill: '#10B981', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="riskReductionCr" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="leading-relaxed">
            <strong>Optimal Spend Zone Insight:</strong> Maximum marginal efficiency occurs between <strong>₹80 Lakh and ₹1.50 Crore</strong>. Beyond ₹2.00 Crore, marginal risk reduction flattens out (diminishing returns).
          </p>
        </div>
      </div>

      {/* Plan Comparisons: Optimal vs Manual vs Do Nothing */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 space-y-4">
        <h2 className="text-xs font-bold text-white tracking-wider">// STRATEGY_COMPARISON_MATRIX</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Do Nothing */}
          <div className="p-3.5 rounded bg-[#020504] border border-rose-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-400 block mb-1">[STATUS_QUO]</span>
              <h3 className="text-xs font-bold text-slate-200">{comparisons.doNothing.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{comparisons.doNothing.description}</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-rose-900/30 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">COST:</span>
                <span className="text-white">₹0</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">SAVED:</span>
                <span className="text-rose-400">₹0</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">RESIDUAL_EAL:</span>
                <span className="text-rose-400 font-bold">{formatRupees(comparisons.doNothing.residualEal)}</span>
              </div>
            </div>
          </div>

          {/* Manual / Ad-hoc */}
          <div className="p-3.5 rounded bg-[#020504] border border-amber-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 block mb-1">[AD_HOC_INTUITIVE]</span>
              <h3 className="text-xs font-bold text-slate-200">{comparisons.manualPlan.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{comparisons.manualPlan.description}</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-900/30 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">COST:</span>
                <span className="text-white">{formatRupees(comparisons.manualPlan.cost)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">SAVED:</span>
                <span className="text-amber-400">{formatRupees(comparisons.manualPlan.riskReduction)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">ROSI:</span>
                <span className="text-amber-400 font-bold">+{comparisons.manualPlan.rosi}%</span>
              </div>
            </div>
          </div>

          {/* ArthaRisk Optimized */}
          <div className="p-3.5 rounded bg-[#020806] border border-emerald-500/40 flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 block mb-1">[ARTHARISK_OPTIMIZED]</span>
              <h3 className="text-xs font-bold text-white">{comparisons.optimizedPlan.name}</h3>
              <p className="text-[10px] text-slate-300 mt-1">{comparisons.optimizedPlan.description}</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-emerald-900/50 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">COST:</span>
                <span className="text-white">{formatRupees(comparisons.optimizedPlan.cost)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">SAVED:</span>
                <span className="text-emerald-400 font-bold">{formatRupees(comparisons.optimizedPlan.riskReduction)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">ROSI:</span>
                <span className="text-emerald-300 font-bold">+{comparisons.optimizedPlan.rosi}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Initiatives Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider">
              // SELECTED_INITIATIVES [{optimizationResult.selectedProjects.length}_PROJECTS_ARMED]
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Algorithmically chosen for maximum financial loss suppression
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-emerald-500/20">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#020504] text-slate-400 font-semibold border-b border-emerald-500/20">
              <tr>
                <th className="py-2.5 px-3">Project Initiative</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Cost (₹)</th>
                <th className="py-2.5 px-3 text-right">Risk Reduction (₹)</th>
                <th className="py-2.5 px-3 text-right">ROSI %</th>
                <th className="py-2.5 px-3">Effort</th>
                <th className="py-2.5 px-3">Framework Mapped</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {optimizationResult.selectedProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    <div>{proj.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{proj.id}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{proj.category}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{formatRupees(proj.cost)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{formatRupees(proj.riskReduction)}</td>
                  <td className="py-2.5 px-3 text-right text-cyan-300 font-bold">+{proj.rosi.toFixed(0)}%</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">{proj.effortWeeks} weeks</td>
                  <td className="py-2.5 px-3 font-sans text-slate-400 truncate max-w-[180px]">
                    {proj.frameworkCoverage.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
