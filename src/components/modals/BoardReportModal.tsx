import { formatRupees, EnterpriseRiskMetrics } from '../../lib/riskEngine';
import { OptimizationResult } from '../../types';
import { ORG_METRICS } from '../../data/mockData';
import { Printer, Download, X, Shield, CheckCircle2 } from 'lucide-react';

interface BoardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: EnterpriseRiskMetrics;
  optimizationResult: OptimizationResult;
}

export function BoardReportModal({
  isOpen,
  onClose,
  metrics,
  optimizationResult,
}: BoardReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-10 text-slate-100">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">Board Executive Memo</span>
            <span aria-hidden="true">·</span>
            <span>Print & PDF Export</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="mt-6 space-y-6 text-slate-200">
          {/* Memo Header */}
          <div className="border-b border-slate-700/80 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
                  CONFIDENTIAL · BOARD OF DIRECTORS BRIEFING
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  Cyber Risk Quantification & Capital Allocation Proposal
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Entity: {ORG_METRICS.name} · Annual Turnover: {formatRupees(ORG_METRICS.annualRevenue)}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono">
                <p>Date: {currentDate}</p>
                <p>Status: Under Board Review</p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Executive Financial Exposure Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-300">
              Unlike traditional qualitative categorizations ("High/Medium/Low"), CyberQuant AI continuously measures enterprise cyber exposure in monetary terms based on real-time telemetry from 7 integrated sources. As of {currentDate}, Aarav FinServe Ltd faces an **Expected Annual Loss (EAL) of {formatRupees(metrics.totalEal)}**, with a 95% Value at Risk (VaR 95%) threshold of **{formatRupees(metrics.totalEal * 2.85)}**. Our current exposure exceeds the Board-mandated risk tolerance limit of **{formatRupees(metrics.riskAppetiteLimit)}** by **{formatRupees(Math.max(0, metrics.totalEal - metrics.riskAppetiteLimit))}**.
            </p>
          </div>

          {/* Core Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400">Current EAL (Baseline)</span>
              <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">
                {formatRupees(metrics.totalEal)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400">95% Value at Risk (VaR)</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                {formatRupees(metrics.totalEal * 2.85)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400">Proposed Budget Allocation</span>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                {formatRupees(optimizationResult.totalCost)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400">Residual Post-Fix EAL</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {formatRupees(optimizationResult.residualEal)}
              </div>
            </div>
          </div>

          {/* Knapsack Investment Plan */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              2. Recommended Capital Investment Plan (0/1 Knapsack Solution)
            </h2>
            <p className="text-xs text-slate-300 mb-3">
              To maximize financial risk reduction under an approved budget envelope of **{formatRupees(optimizationResult.budget)}**, our optimization engine selected **{optimizationResult.selectedProjects.length} candidate initiatives**, delivering an aggregate risk reduction of **{formatRupees(optimizationResult.totalRiskReduction)}** at an overall **ROSI of {optimizationResult.overallRosi}%**.
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Project Initiative</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Cost (₹)</th>
                    <th className="py-2.5 px-3 text-right">Risk Reduction (₹)</th>
                    <th className="py-2.5 px-3 text-right">ROSI %</th>
                    <th className="py-2.5 px-3">Timeframe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {optimizationResult.selectedProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-sans font-medium text-slate-200">{p.title}</td>
                      <td className="py-2 px-3 text-slate-400">{p.category}</td>
                      <td className="py-2 px-3 text-right text-slate-300">{formatRupees(p.cost)}</td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-semibold">{formatRupees(p.riskReduction)}</td>
                      <td className="py-2 px-3 text-right text-cyan-300">+{p.rosi.toFixed(1)}%</td>
                      <td className="py-2 px-3 font-sans text-slate-400">{p.effortWeeks} wks</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950 font-bold border-t border-slate-700">
                    <td className="py-2 px-3 text-white font-sans">Total Selected Portfolio</td>
                    <td className="py-2 px-3 text-slate-400">Combined</td>
                    <td className="py-2 px-3 text-right text-cyan-300">{formatRupees(optimizationResult.totalCost)}</td>
                    <td className="py-2 px-3 text-right text-emerald-400">{formatRupees(optimizationResult.totalRiskReduction)}</td>
                    <td className="py-2 px-3 text-right text-cyan-300">+{optimizationResult.overallRosi}%</td>
                    <td className="py-2 px-3 font-sans text-slate-400">8 wks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulatory and Compliance Assurance */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              3. Regulatory Compliance & Audit Readiness
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">RBI Cyber Security Framework</span>
                <p className="text-slate-400 text-[11px]">
                  Fulfills Annex 1 mandates on privileged MFA, automated patch SLAs, and isolated SFMS networks.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">SEBI CSCRF Framework</span>
                <p className="text-slate-400 text-[11px]">
                  Ensures colocation isolation, 15-minute recovery point objective, and privileged session recording.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Digital Personal Data Protection Act</span>
                <p className="text-slate-400 text-[11px]">
                  Protects 6.8M customer PII records against Section 8 breach liabilities and statutory penalties.
                </p>
              </div>
            </div>
          </div>

          {/* Signoff Blocks */}
          <div className="pt-6 border-t border-slate-700/80 grid grid-cols-2 gap-8 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-300">Presented by:</p>
              <p className="mt-4 border-b border-slate-700 pb-1 text-slate-200 font-medium">
                Chief Information Security Officer (CISO)
              </p>
              <p className="text-[11px] mt-1">Aarav FinServe Ltd · Security Governance Office</p>
            </div>
            <div>
              <p className="font-semibold text-slate-300">Board Authorization:</p>
              <p className="mt-4 border-b border-slate-700 pb-1 text-slate-400 italic">
                Pending Board Approval & Budget Release
              </p>
              <p className="text-[11px] mt-1">Audit & Risk Management Committee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
