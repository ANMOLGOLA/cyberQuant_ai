import { useState, useMemo } from 'react';
import { CalculatedAsset, formatRupees } from '../../lib/riskEngine';
import { Grid, Eye, AlertTriangle, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface RiskHeatmapProps {
  assets: CalculatedAsset[];
  onSelectAsset: (asset: CalculatedAsset) => void;
}

// 5x5 Matrix definition
// Likelihood: 1 (<10%), 2 (10-25%), 3 (25-45%), 4 (45-70%), 5 (>70%)
// Impact: 1 (<₹2 Cr), 2 (₹2-5 Cr), 3 (₹5-10 Cr), 4 (₹10-20 Cr), 5 (>₹20 Cr)

function getLikelihoodBin(likelihood: number): number {
  if (likelihood >= 0.70) return 5;
  if (likelihood >= 0.45) return 4;
  if (likelihood >= 0.25) return 3;
  if (likelihood >= 0.10) return 2;
  return 1;
}

function getImpactBin(impact: number): number {
  // impact in INR
  if (impact >= 200000000) return 5; // > ₹20 Cr
  if (impact >= 100000000) return 4; // ₹10 - 20 Cr
  if (impact >= 50000000) return 3;  // ₹5 - 10 Cr
  if (impact >= 20000000) return 2;  // ₹2 - 5 Cr
  return 1;                          // < ₹2 Cr
}

// Color coding for each cell based on combined risk score (L * I from 1 to 25)
function getCellSeverity(lBin: number, iBin: number): {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  bgClass: string;
  borderClass: string;
  textClass: string;
} {
  const score = lBin * iBin;
  if (score >= 16) {
    return {
      severity: 'Critical',
      bgClass: 'bg-rose-950/40 hover:bg-rose-900/60',
      borderClass: 'border-rose-500/40',
      textClass: 'text-rose-300',
    };
  }
  if (score >= 9) {
    return {
      severity: 'High',
      bgClass: 'bg-amber-950/40 hover:bg-amber-900/60',
      borderClass: 'border-amber-500/40',
      textClass: 'text-amber-300',
    };
  }
  if (score >= 4) {
    return {
      severity: 'Medium',
      bgClass: 'bg-cyan-950/30 hover:bg-cyan-900/50',
      borderClass: 'border-cyan-500/30',
      textClass: 'text-cyan-300',
    };
  }
  return {
    severity: 'Low',
    bgClass: 'bg-emerald-950/20 hover:bg-emerald-900/40',
    borderClass: 'border-emerald-500/20',
    textClass: 'text-emerald-300',
  };
}

export function RiskHeatmap({ assets, onSelectAsset }: RiskHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{ lBin: number; iBin: number } | null>(null);
  const [selectedBU, setSelectedBU] = useState<string>('All');

  const filteredAssets = useMemo(() => {
    if (selectedBU === 'All') return assets;
    return assets.filter((a) => a.businessUnit === selectedBU);
  }, [assets, selectedBU]);

  // Map assets into 5x5 grid cells
  const gridCells = useMemo(() => {
    const grid: Record<string, CalculatedAsset[]> = {};
    for (let l = 1; l <= 5; l++) {
      for (let i = 1; i <= 5; i++) {
        grid[`${l}-${i}`] = [];
      }
    }

    filteredAssets.forEach((asset) => {
      const l = getLikelihoodBin(asset.compositeLikelihood);
      const i = getImpactBin(asset.compositeImpact);
      grid[`${l}-${i}`]?.push(asset);
    });

    return grid;
  }, [filteredAssets]);

  const likelihoodLabels = [
    { bin: 5, label: 'Very High (>70%)' },
    { bin: 4, label: 'High (45-70%)' },
    { bin: 3, label: 'Medium (25-45%)' },
    { bin: 2, label: 'Low (10-25%)' },
    { bin: 1, label: 'Very Low (<10%)' },
  ];

  const impactLabels = [
    { bin: 1, label: '< ₹2 Cr' },
    { bin: 2, label: '₹2 - 5 Cr' },
    { bin: 3, label: '₹5 - 10 Cr' },
    { bin: 4, label: '₹10 - 20 Cr' },
    { bin: 5, label: '> ₹20 Cr' },
  ];

  const activeAssetsInCell = selectedCell
    ? gridCells[`${selectedCell.lBin}-${selectedCell.iBin}`] || []
    : [];

  const businessUnits = [
    'All',
    'Retail Banking',
    'Payments/UPI',
    'Trading Platform',
    'HR and Corporate IT',
    'Cloud/DevOps',
  ];

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              // RISK_HEATMAP_MATRIX [LIKELIHOOD × MONETARY IMPACT]
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            5×5 asset concentration matrix. Click any coordinate to reveal quarantined assets.
          </p>
        </div>

        {/* Business Unit Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold uppercase">
            <Filter className="w-3 h-3 text-emerald-400" /> UNIT:
          </span>
          <select
            value={selectedBU}
            onChange={(e) => {
              setSelectedBU(e.target.value);
              setSelectedCell(null);
            }}
            aria-label="Filter by Business Unit"
            className="text-xs bg-[#020504] border border-emerald-500/30 rounded px-2.5 py-1 text-emerald-300 focus:outline-none focus:border-emerald-400 cursor-pointer font-mono"
          >
            {businessUnits.map((bu) => (
              <option key={bu} value={bu}>
                {bu === 'All' ? 'All Units' : bu}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Matrix (8 cols on desktop) */}
        <div className="lg:col-span-8 overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Top Y-Axis Indicator Label */}
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>↑ LIKELIHOOD OF EXPLOIT (ANNUAL PROBABILITY)</span>
              <span className="text-slate-500 lowercase font-normal font-sans text-[11px]">
                Showing {filteredAssets.length} assets
              </span>
            </div>

            {/* Grid rows */}
            <div className="space-y-1.5">
              {likelihoodLabels.map(({ bin: lBin, label: lLabel }) => (
                <div key={lBin} className="flex items-center gap-2">
                  {/* Y-Axis Label */}
                  <div className="w-28 text-[11px] font-mono text-slate-400 text-right pr-2 shrink-0 truncate" title={lLabel}>
                    {lLabel}
                  </div>

                  {/* 5 columns for Impact */}
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {impactLabels.map(({ bin: iBin }) => {
                      const cellAssets = gridCells[`${lBin}-${iBin}`] || [];
                      const count = cellAssets.length;
                      const { bgClass, borderClass, textClass, severity } = getCellSeverity(lBin, iBin);
                      const isSelected = selectedCell?.lBin === lBin && selectedCell?.iBin === iBin;

                      return (
                        <button
                          key={`${lBin}-${iBin}`}
                          onClick={() => {
                            if (count > 0) {
                              setSelectedCell(isSelected ? null : { lBin, iBin });
                            }
                          }}
                          disabled={count === 0}
                          className={`h-14 rounded-xl border transition-all flex flex-col items-center justify-center relative cursor-pointer ${bgClass} ${borderClass} ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] z-10'
                              : ''
                          } ${count === 0 ? 'opacity-30 cursor-default' : 'hover:scale-[1.02]'}`}
                          title={`${severity} Zone: ${count} assets`}
                        >
                          <span className={`text-base font-extrabold font-mono tabular-nums ${count > 0 ? textClass : 'text-slate-600'}`}>
                            {count}
                          </span>
                          {count > 0 && (
                            <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                              {count === 1 ? 'asset' : 'assets'}
                            </span>
                          )}

                          {/* Pulsing beacon dot on critical cell with assets */}
                          {count > 0 && severity === 'Critical' && (
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* X-Axis Labels */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
              <div className="w-28 shrink-0 text-right pr-2 text-[10px] text-slate-500 font-mono">
                IMPACT →
              </div>
              <div className="grid grid-cols-5 gap-1.5 flex-1 text-center font-mono text-[10px] text-slate-400">
                {impactLabels.map((imp) => (
                  <div key={imp.bin} className="truncate" title={imp.label}>
                    {imp.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80 border border-rose-400" />
                  <span className="text-rose-300">Critical (Score 16-25)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 border border-amber-400" />
                  <span className="text-amber-300">High (Score 9-15)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/80 border border-cyan-400" />
                  <span className="text-cyan-300">Medium (Score 4-8)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 border border-emerald-400" />
                  <span className="text-emerald-300">Low (Score 1-3)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cell Assets Drawer (4 cols on desktop) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {selectedCell ? 'Selected Cell Drill-Down' : 'Highest-Risk Cluster'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">
                {selectedCell ? `${activeAssetsInCell.length} Assets` : 'Top Critical'}
              </span>
            </div>

            {/* List of assets in the selected cell, or default to top critical assets */}
            <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {(selectedCell ? activeAssetsInCell : filteredAssets.slice(0, 4)).map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate flex-1">
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {asset.id} · {asset.businessUnit}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-cyan-400 block">
                        {formatRupees(asset.eal)}
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 block">
                        {(asset.compositeLikelihood * 100).toFixed(0)}% L
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800/60 font-mono">
                    <span>Impact: {formatRupees(asset.compositeImpact)}</span>
                    <span className="text-cyan-400 group-hover:underline">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            {selectedCell ? (
              <p>
                Showing assets in Likelihood Bin #{selectedCell.lBin} and Impact Bin #{selectedCell.iBin}.
              </p>
            ) : (
              <p className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Click any cell on the matrix to isolate and inspect its assets.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
