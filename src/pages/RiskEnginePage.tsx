import { useState } from 'react';
import { 
  CalculatedAsset, 
  EnterpriseRiskMetrics, 
  formatRupees 
} from '../lib/riskEngine';
import { runMonteCarloSimulation } from '../lib/monteCarlo';
import { TELEMETRY_SOURCES } from '../data/mockData';
import { BusinessUnit, TelemetrySource } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  Database, 
  RefreshCw, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Globe, 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Cpu, 
  Zap 
} from 'lucide-react';

interface RiskEnginePageProps {
  metrics: EnterpriseRiskMetrics;
  assets: CalculatedAsset[];
  onSelectAsset: (asset: CalculatedAsset) => void;
}

export function RiskEnginePage({
  metrics,
  assets,
  onSelectAsset,
}: RiskEnginePageProps) {
  const [sources, setSources] = useState<TelemetrySource[]>(TELEMETRY_SOURCES);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBU, setSelectedBU] = useState<string>('All');
  const [selectedExposure, setSelectedExposure] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'eal' | 'likelihood' | 'impact' | 'criticality'>('eal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Monte Carlo simulation state
  const [monteCarloResult, setMonteCarloResult] = useState(() =>
    runMonteCarloSimulation(assets, 5000)
  );
  const [isSimulating, setIsSimulating] = useState(false);

  // Handle "Sync Now" for a telemetry source
  const handleSyncSource = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, lastSync: 'Just now', recordsIngested: s.recordsIngested + Math.floor(Math.random() * 85 + 10) }
            : s
        )
      );
      setSyncingId(null);
    }, 800);
  };

  const handleRunMonteCarlo = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = runMonteCarloSimulation(assets, 5000);
      setMonteCarloResult(res);
      setIsSimulating(false);
    }, 250);
  };

  // Filtered & Sorted Assets
  const filteredAssets = assets
    .filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.businessUnit.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBU = selectedBU === 'All' || a.businessUnit === selectedBU;
      const matchesExposure =
        selectedExposure === 'All' ||
        (selectedExposure === 'Internet' && a.isInternetFacing) ||
        (selectedExposure === 'Internal' && !a.isInternetFacing);
      return matchesSearch && matchesBU && matchesExposure;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'eal') diff = b.eal - a.eal;
      else if (sortBy === 'likelihood') diff = b.compositeLikelihood - a.compositeLikelihood;
      else if (sortBy === 'impact') diff = b.compositeImpact - a.compositeImpact;
      else if (sortBy === 'criticality') diff = b.criticality - a.criticality;
      return sortOrder === 'asc' ? -diff : diff;
    });

  const businessUnits: (BusinessUnit | 'All')[] = [
    'All',
    'Retail Banking',
    'Payments/UPI',
    'Trading Platform',
    'HR and Corporate IT',
    'Cloud/DevOps',
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-mono">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-emerald-400 font-bold">[ENGINE_STATUS: ONLINE]</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400">MONTE_CARLO_TELEMETRY</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
          // RISK_QUANT_ENGINE & ASSET_LEDGER
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Monitors 7 real-time telemetry pipelines; derives asset exploit probabilities via CVSS/EPSS and computes monetary Expected Annual Loss.
        </p>
      </div>

      {/* 1. Telemetry Ingestion Source Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            [ACTIVE_INGESTION_CONNECTORS] (7 PIPELINES)
          </h2>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ALL_FEEDS_NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {sources.map((src) => {
            const isSyncing = syncingId === src.id;
            return (
              <div
                key={src.id}
                className="p-3 rounded bg-[#030907] border border-emerald-500/25 flex flex-col justify-between hover:border-emerald-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-emerald-400">{src.category}</span>
                    <button
                      onClick={() => handleSyncSource(src.id)}
                      disabled={isSyncing}
                      className="text-slate-400 hover:text-emerald-300 p-0.5 rounded cursor-pointer"
                      title="Sync Pipeline Telemetry Now"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{src.vendor}</div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-emerald-500/20">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">EVENTS:</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      {(src.recordsIngested / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 mt-0.5">
                    <span>SYNC:</span>
                    <span className="text-slate-400">{src.lastSync}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Monte Carlo Loss Distribution Histogram */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white tracking-wider">// MONTE_CARLO_SIMULATION (5,000 RUNS)</h2>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Empirical loss frequency curve deriving Value at Risk (95% tail)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">VaR 95%: </span>
              <span className="text-rose-400 font-bold">{formatRupees(monteCarloResult.var95)}</span>
              <span className="text-slate-500 ml-2">CVaR: </span>
              <span className="text-amber-400 font-semibold">{formatRupees(monteCarloResult.cvar95)}</span>
            </div>
            <button
              onClick={handleRunMonteCarlo}
              disabled={isSimulating}
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Running...' : 'Re-Run Simulation'}</span>
            </button>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monteCarloResult.histogram} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <XAxis dataKey="rangeLabel" stroke="#64748B" fontSize={10} tickLine={false} interval={2} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#091026', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any) => [`${val} simulations`, 'Frequency']}
              />
              <Bar dataKey="frequency" fill="#7C4DFF" radius={[3, 3, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
          <div>
            <span>Execution Runtime: </span>
            <span className="text-cyan-400">{monteCarloResult.runTimeMs}ms</span>
          </div>
          <div>
            <span>Median Loss: </span>
            <span className="text-slate-200">{formatRupees(monteCarloResult.medianLoss)}</span>
          </div>
          <div>
            <span>Mean (EAL): </span>
            <span className="text-cyan-300 font-semibold">{formatRupees(monteCarloResult.meanLoss)}</span>
          </div>
          <div>
            <span>99th Percentile Worst Case: </span>
            <span className="text-rose-400 font-semibold">{formatRupees(monteCarloResult.var99)}</span>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Asset Inventory Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-2 tracking-wider">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              // ASSET_INVENTORY_LEDGER [{filteredAssets.length}/{assets.length}_NODES]
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Click any node row to inspect formula derivation and dependency graph
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets, IDs, CVEs..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-[#020504] border border-emerald-500/30 text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-500/20 text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1 font-semibold text-[10px] uppercase">
            <Filter className="w-3 h-3 text-emerald-400" /> FILTERS:
          </span>

          {/* Business Unit Segmented Selector */}
          <div className="flex flex-wrap items-center gap-1 p-0.5 bg-[#020504] rounded border border-emerald-500/25">
            {businessUnits.map((bu) => (
              <button
                key={bu}
                onClick={() => setSelectedBU(bu)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  selectedBU === bu
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {bu === 'All' ? 'ALL_UNITS' : bu.replace('Platform', '').replace('and Corporate IT', 'Corp IT').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Exposure filter */}
          <div className="flex items-center gap-1 p-0.5 bg-[#020504] rounded border border-emerald-500/25 ml-auto">
            <button
              onClick={() => setSelectedExposure('All')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                selectedExposure === 'All' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedExposure('Internet')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                selectedExposure === 'Internet' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
              }`}
            >
              INTERNET_FACING
            </button>
            <button
              onClick={() => setSelectedExposure('Internal')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                selectedExposure === 'Internal' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
              }`}
            >
              INTERNAL_ONLY
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Asset ID & Name</th>
                <th className="py-3 px-3">Business Unit</th>
                <th className="py-3 px-3 text-center">Criticality</th>
                <th className="py-3 px-3 text-center">Exposure</th>
                <th className="py-3 px-3 text-center">Open Vulns</th>
                <th className="py-3 px-3 text-right">Control Eff.</th>
                <th
                  onClick={() => {
                    setSortBy('likelihood');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <span className="flex items-center justify-end gap-1">
                    Likelihood P <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => {
                    setSortBy('impact');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <span className="flex items-center justify-end gap-1">
                    Single Impact (₹) <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => {
                    setSortBy('eal');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-cyan-400"
                >
                  <span className="flex items-center justify-end gap-1 text-cyan-400 font-bold">
                    EAL (₹) <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-3 px-3 text-center">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 font-sans">
                    No assets found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {asset.id} · {asset.type}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-sans text-slate-300">
                      {asset.businessUnit}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="font-semibold text-slate-200">Tier {asset.criticality}</span>
                    </td>

                    <td className="py-2.5 px-3 text-center font-sans">
                      {asset.isInternetFacing ? (
                        <span className="text-amber-400 text-[10px] font-medium">Internet</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Internal</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {asset.vulnerabilities.length > 0 ? (
                        <span className="font-bold text-rose-400">
                          {asset.vulnerabilities.length} ({asset.vulnerabilities[0]?.cve.split('-')[1]})
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span className={`font-semibold ${
                        asset.controls.length > 0 && asset.controls[0].effectiveness > 0.8
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}>
                        {(asset.controls.reduce((sum, c) => sum + c.effectiveness, 0) / (asset.controls.length || 1) * 100).toFixed(0)}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right text-amber-300">
                      {(asset.compositeLikelihood * 100).toFixed(1)}%
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {formatRupees(asset.compositeImpact)}
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-cyan-400 text-xs">
                      {formatRupees(asset.eal)}
                    </td>

                    <td className="py-2.5 px-3 text-center font-sans">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          asset.riskLevel === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : asset.riskLevel === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {asset.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
