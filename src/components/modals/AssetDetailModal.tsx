import { useState } from 'react';
import { CalculatedAsset, formatRupees } from '../../lib/riskEngine';
import { X, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, ShieldAlert, Globe, Server, Link2, Calculator } from 'lucide-react';

interface AssetDetailModalProps {
  asset: CalculatedAsset | null;
  onClose: () => void;
}

export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#091026] border border-cyan-500/25 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-mono text-cyan-400">{asset.id}</span>
              <span aria-hidden="true">·</span>
              <span>{asset.businessUnit}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                {asset.isInternetFacing ? (
                  <span className="text-amber-400 flex items-center gap-1"><Globe className="w-3 h-3" /> Internet-Facing</span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1"><Server className="w-3 h-3" /> Internal Isolated</span>
                )}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{asset.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Asset Owner: {asset.owner}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Risk Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Expected Annual Loss</span>
            <div className="text-lg font-bold font-mono tabular-nums text-cyan-400 mt-0.5">
              {formatRupees(asset.eal)}
            </div>
            <span className="text-[11px] text-slate-400">P × Single Loss Impact</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Annual Likelihood</span>
            <div className="text-lg font-bold font-mono tabular-nums text-amber-400 mt-0.5">
              {(asset.compositeLikelihood * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-400">Exploit probability</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Single Loss Exposure</span>
            <div className="text-lg font-bold font-mono tabular-nums text-rose-400 mt-0.5">
              {formatRupees(asset.compositeImpact)}
            </div>
            <span className="text-[11px] text-slate-400">Max potential impact</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Criticality Rating</span>
            <div className="text-lg font-bold font-mono text-violet-400 mt-0.5">
              Tier {asset.criticality} / 5
            </div>
            <span className="text-[11px] text-slate-400">Business impact tier</span>
          </div>
        </div>

        {/* Impact Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Financial Impact Breakdown (Worst-Case Scenario)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Downtime Interruption:</span>
              <div className="text-sm font-semibold font-mono text-slate-200 mt-0.5">
                {formatRupees(asset.lossBreakdown.downtime)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{asset.downtimeHoursEstimate} hrs × {formatRupees(asset.hourlyRevenueDependency)}/hr</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Data Breach Liabilities:</span>
              <div className="text-sm font-semibold font-mono text-slate-200 mt-0.5">
                {formatRupees(asset.lossBreakdown.dataBreach)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{(asset.dataRecordsCount / 100000).toFixed(1)}L records × ₹280</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Regulatory Penalty:</span>
              <div className="text-sm font-semibold font-mono text-slate-200 mt-0.5">
                {formatRupees(asset.lossBreakdown.regulatory)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{asset.regulatoryJurisdiction} jurisdiction cap</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Reputational & Churn:</span>
              <div className="text-sm font-semibold font-mono text-slate-200 mt-0.5">
                {formatRupees(asset.lossBreakdown.reputational)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Scaled by annual turnover</p>
            </div>
          </div>
        </div>

        {/* Dependency Mini-Graph */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>Dependency Graph & Blast Radius</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="w-full sm:w-1/3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">Upstream Dependencies:</span>
              {asset.upstreamDependencies.length > 0 ? (
                asset.upstreamDependencies.map((dep) => (
                  <div key={dep} className="font-mono text-cyan-300 text-[11px] truncate">← {dep}</div>
                ))
              ) : (
                <span className="text-slate-400 italic">None (Root Gateway)</span>
              )}
            </div>

            <div className="px-3 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center w-full sm:w-1/3">
              <span className="text-[11px] text-cyan-400 font-semibold block">CURRENT ASSET</span>
              <span className="font-mono text-xs text-white truncate block">{asset.id}</span>
            </div>

            <div className="w-full sm:w-1/3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">Downstream Impacted:</span>
              {asset.downstreamDependencies.length > 0 ? (
                asset.downstreamDependencies.map((dep) => (
                  <div key={dep} className="font-mono text-rose-300 text-[11px] truncate">→ {dep}</div>
                ))
              ) : (
                <span className="text-slate-400 italic">None (Terminal Endpoint)</span>
              )}
            </div>
          </div>
        </div>

        {/* Vulnerabilities & Active Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Vulns */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Vulnerabilities ({asset.vulnerabilities.length})
              </span>
            </h4>
            {asset.vulnerabilities.length === 0 ? (
              <p className="text-xs text-slate-400">No open CVEs detected on this asset.</p>
            ) : (
              <div className="space-y-2">
                {asset.vulnerabilities.map((v) => (
                  <div key={v.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-rose-400">{v.cve}</span>
                      <span className="font-mono text-[11px] text-slate-400">CVSS {v.cvss} · EPSS {(v.epss * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-slate-300 text-[11px] line-clamp-2">{v.title}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                      {v.cisaKev && <span className="text-rose-400 font-semibold">CISA KEV Listed</span>}
                      {v.threatIntelActive && <span className="text-amber-400 font-semibold">Weaponized in Wild</span>}
                      <span className="ml-auto font-mono text-slate-400">Fix Cost: {formatRupees(v.remediationCost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Applicable Security Controls ({asset.controls.length})
              </span>
            </h4>
            <div className="space-y-2">
              {asset.controls.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{c.name}</span>
                    <span className={`font-mono text-[11px] ${c.implementationStatus === 'Full' ? 'text-emerald-400' : c.implementationStatus === 'Partial' ? 'text-amber-400' : 'text-rose-400'}`}>
                      {c.implementationStatus} ({(c.effectiveness * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                    <span>Category: {c.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">Mapped: {c.frameworks.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* "How this is calculated" Expandable Mathematical Section */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-cyan-300 hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              How this is calculated (Step-by-Step Mathematical Proof)
            </span>
            {showFormulaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFormulaDetails && (
            <div className="p-4 pt-1 border-t border-slate-800 text-xs font-mono text-slate-300 space-y-3 bg-slate-950/80">
              <div>
                <span className="text-cyan-400 font-semibold">1. Exploit Probability p_i per Vulnerability:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formula: p_i = base_prob × threat_mult × exposure_factor × (1 - control_eff)
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 mt-1 text-[11px] text-slate-300">
                  Exposure: {asset.calculationDetails.exposureMultiplier}x ({asset.isInternetFacing ? 'Internet' : 'Internal'}) · Control Deficit: {(asset.calculationDetails.controlDeficit * 100).toFixed(1)}% · Threat Multiplier: {asset.calculationDetails.threatMultipliers[0]?.toFixed(2) || '1.00'}x
                </div>
              </div>

              <div>
                <span className="text-cyan-400 font-semibold">2. Asset Composite Likelihood P:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formula: P = 1 - ∏(1 - p_i) across all vulnerabilities
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 mt-1 text-[11px] text-amber-300">
                  Result: P = {(asset.compositeLikelihood * 100).toFixed(2)}% probability of at least one exploit this year
                </div>
              </div>

              <div>
                <span className="text-cyan-400 font-semibold">3. Worst-Case Impact (INR):</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formula: (Downtime + Breach + Regulatory + Reputational) × Criticality_Multiplier
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 mt-1 text-[11px] text-slate-300">
                  = ({formatRupees(asset.calculationDetails.downtimeLoss)} + {formatRupees(asset.calculationDetails.breachLoss)} + {formatRupees(asset.calculationDetails.regulatoryLoss)} + {formatRupees(asset.calculationDetails.reputationalLoss)}) × {asset.calculationDetails.criticalityMultiplier.toFixed(2)}
                  <br />
                  = <span className="text-rose-400 font-bold">{formatRupees(asset.compositeImpact)}</span>
                </div>
              </div>

              <div>
                <span className="text-cyan-400 font-semibold">4. Expected Annual Loss (EAL):</span>
                <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/30 mt-1 text-[11px] text-cyan-200">
                  EAL = P × Impact = {(asset.compositeLikelihood * 100).toFixed(2)}% × {formatRupees(asset.compositeImpact)} = <span className="font-bold text-cyan-400 text-xs">{formatRupees(asset.eal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
