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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Capital Optimization Engine</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-mono">0/1 Knapsack Mathematical Solver</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Cybersecurity Investment Optimization
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Solves the combinatorial 0/1 knapsack problem to select the highest-ROSI portfolio of security initiatives under any fixed budget constraint.
          </p>
        </div>

        <button
          onClick={() => onOpenBoardReport(optimizationResult)}
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Export Board Report</span>
        </button>
      </div>

      {/* Budget Slider Controller */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Allocate Annual Security Budget Envelope
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag slider to re-solve 0/1 knapsack and recalculate residual Expected Annual Loss.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {formatRupees(budget)}
            </span>
            <span className="text-xs text-slate-400 font-sans block">
              {budget >= 10000000 ? `${(budget / 10000000).toFixed(2)} Crore` : `${(budget / 100000).toFixed(0)} Lakh`}
            </span>
          </div>
        </div>

        {/* The Slider */}
        <div className="pt-2">
          <input
            type="range"
            min="1000000" // ₹10 Lakh
            max="100000000" // ₹10 Crore
            step="1000000" // ₹10 Lakh steps
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
            <span>₹10 Lakh (Min)</span>
            <span className="text-cyan-400">Current: {formatRupees(budget)}</span>
            <span>₹10.00 Crore (Max)</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 mr-1">Quick Presets:</span>
          {[
            { label: '₹50 Lakh', value: 5000000 },
            { label: '₹1.00 Crore (Recommended)', value: 10000000 },
            { label: '₹2.00 Crore', value: 20000000 },
            { label: '₹3.50 Crore', value: 35000000 },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setBudget(preset.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                budget === preset.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Outcome KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Selected Portfolio Spend</span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            {formatRupees(optimizationResult.totalCost)}
          </div>
          <span className="text-[11px] text-slate-400">
            {((optimizationResult.totalCost / budget) * 100).toFixed(0)}% of budget utilized
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Total Quantified Risk Reduction</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatRupees(optimizationResult.totalRiskReduction)}
          </div>
          <span className="text-[11px] text-slate-400">EAL compressed</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Residual Enterprise EAL</span>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {formatRupees(optimizationResult.residualEal)}
          </div>
          <span className="text-[11px] text-emerald-400">
            {metrics.totalEal > 0 ? `${((optimizationResult.totalRiskReduction / metrics.totalEal) * 100).toFixed(0)}% risk reduction` : '0%'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Portfolio ROSI (Return)</span>
          <div className="text-xl font-bold font-mono text-violet-400 mt-1">
            +{optimizationResult.overallRosi}%
          </div>
          <span className="text-[11px] text-slate-400">Net risk saved per rupee</span>
        </div>
      </div>

      {/* Diminishing Returns Frontier Curve */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Investment vs. Risk Reduction Frontier Curve
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Highlighting the diminishing-returns knee point and the Optimal Spend Zone
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Knapsack Frontier
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Optimal Knee (₹1.20 Cr)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartCurveData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <XAxis dataKey="budgetCr" stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#091026', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any) => [`₹${val} Cr Reduced`, 'Risk Reduction']}
                labelFormatter={(label) => `Budget: ₹${label} Cr`}
              />
              {/* Optimal Spend Zone Shaded Area */}
              <ReferenceArea x1={0.8} x2={1.6} strokeOpacity={0.3} fill="#00E5FF" fillOpacity={0.06} />
              {/* Current Budget Marker */}
              <ReferenceLine x={currentBudgetCr} stroke="#00E5FF" strokeDasharray="3 3" label={{ value: 'Your Budget', fill: '#00E5FF', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="riskReductionCr" stroke="#00E5FF" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00E5FF' }} />
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
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white">Strategy Comparison Matrix</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Do Nothing */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-400 block mb-1">Status Quo</span>
              <h3 className="text-sm font-bold text-slate-200">{comparisons.doNothing.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{comparisons.doNothing.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Cost:</span>
                <span className="text-white">₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Saved:</span>
                <span className="text-rose-400">₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Residual EAL:</span>
                <span className="text-rose-400 font-bold">{formatRupees(comparisons.doNothing.residualEal)}</span>
              </div>
            </div>
          </div>

          {/* Manual / Ad-hoc */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 block mb-1">Ad-Hoc / Intuitive</span>
              <h3 className="text-sm font-bold text-slate-200">{comparisons.manualPlan.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{comparisons.manualPlan.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Cost:</span>
                <span className="text-white">{formatRupees(comparisons.manualPlan.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Saved:</span>
                <span className="text-amber-400">{formatRupees(comparisons.manualPlan.riskReduction)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ROSI:</span>
                <span className="text-amber-400">+{comparisons.manualPlan.rosi}%</span>
              </div>
            </div>
          </div>

          {/* CyberQuant AI Optimized */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex flex-col justify-between shadow-lg shadow-cyan-500/10">
            <div>
              <span className="text-xs font-semibold text-cyan-400 block mb-1">Recommended Solution</span>
              <h3 className="text-sm font-bold text-white">{comparisons.optimizedPlan.name}</h3>
              <p className="text-xs text-slate-300 mt-1">{comparisons.optimizedPlan.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-cyan-900/60 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Cost:</span>
                <span className="text-white">{formatRupees(comparisons.optimizedPlan.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Saved:</span>
                <span className="text-emerald-400 font-bold">{formatRupees(comparisons.optimizedPlan.riskReduction)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ROSI:</span>
                <span className="text-cyan-300 font-bold">+{comparisons.optimizedPlan.rosi}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Initiatives Table */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              Selected Initiatives in Optimized Portfolio ({optimizationResult.selectedProjects.length} Projects)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Derived via 0/1 knapsack dynamic programming under ₹{formatRupees(budget)} budget constraint
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
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
