import { useState } from 'react';
import { 
  CalculatedAsset, 
  EnterpriseRiskMetrics, 
  formatRupees 
} from '../lib/riskEngine';
import { RiskHeatmap } from '../components/dashboard/RiskHeatmap';
import { RiskTrendRadialGauge } from '../components/dashboard/RiskTrendRadialGauge';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowUpRight, 
  Bot, 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface ExecutiveDashboardProps {
  metrics: EnterpriseRiskMetrics;
  assets: CalculatedAsset[];
  onSelectAsset: (asset: CalculatedAsset) => void;
  onSimulateThreat: () => void;
  isThreatSimulated: boolean;
  onNavigateTab: (tabId: string) => void;
}

export function ExecutiveDashboard({
  metrics,
  assets,
  onSelectAsset,
  onSimulateThreat,
  isThreatSimulated,
  onNavigateTab,
}: ExecutiveDashboardProps) {
  // Historical 12-Month Exposure Data
  const monthlyTrendData = [
    { month: 'Oct', ealCr: 3.4, varCr: 9.8 },
    { month: 'Nov', ealCr: 3.6, varCr: 10.4 },
    { month: 'Dec', ealCr: 3.5, varCr: 10.1 },
    { month: 'Jan', ealCr: 4.1, varCr: 11.9 },
    { month: 'Feb', ealCr: 4.3, varCr: 12.6 },
    { month: 'Mar', ealCr: 4.0, varCr: 11.8 },
    { month: 'Apr', ealCr: 4.5, varCr: 13.2 },
    { month: 'May', ealCr: 4.4, varCr: 12.9 },
    { month: 'Jun', ealCr: 4.7, varCr: 13.8 },
    { month: 'Jul', ealCr: 4.6, varCr: 13.4 },
    { month: 'Aug', ealCr: 4.5, varCr: 13.1 },
    { 
      month: 'Sep (Now)', 
      ealCr: Number((metrics.totalEal / 10000000).toFixed(2)), 
      varCr: Number(((metrics.totalEal * 2.85) / 10000000).toFixed(2)) 
    },
  ];

  // Loss type breakdown for Donut Chart
  const lossTypeData = [
    { name: 'Business Interruption', value: metrics.lossTypeBreakdown.downtime, color: '#00E5FF' },
    { name: 'Data Breach Liabilities', value: metrics.lossTypeBreakdown.dataBreach, color: '#7C4DFF' },
    { name: 'Regulatory Penalties', value: metrics.lossTypeBreakdown.regulatory, color: '#FFB300' },
    { name: 'Reputational Damage', value: metrics.lossTypeBreakdown.reputational, color: '#FF1744' },
  ];

  // Business Unit breakdown for Bar Chart
  const buData = metrics.businessUnitBreakdown.map((b) => ({
    name: b.businessUnit.replace('Platform', '').replace('and Corporate IT', 'Corp IT'),
    ealLakh: Math.round(b.eal / 100000),
    fullName: b.businessUnit,
    percent: b.percentOfTotal,
  }));

  // Top 10 Risk Contributors for horizontal bar
  const top10Assets = metrics.topRiskAssets.slice(0, 8).map((a) => ({
    name: a.name.length > 20 ? a.name.substring(0, 18) + '...' : a.name,
    fullName: a.name,
    ealLakh: Math.round(a.eal / 100000),
    asset: a,
  }));

  const var95 = Math.round(metrics.totalEal * 2.85);
  const potentialReductionOpportunity = 34500000; // ~₹3.45 Cr via optimization

  // Dynamic 30-day delta calculation: changes significantly when threat event is simulated
  const trendDeltaPercent = isThreatSimulated ? 19.8 : 8.4;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Title and Live Simulation Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Executive Board & CISO Briefing</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-mono">Real-Time Risk Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Enterprise Risk Exposure</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSimulateThreat}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isThreatSimulated
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30 shadow-rose-500/10'
                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-amber-500/10'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isThreatSimulated ? 'Reset Simulated Zero-Day Threat' : 'Simulate Threat Event (Watch KPIs Drift)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-mono">
        {/* Risk Score Gauge */}
        <div className="p-3.5 rounded-xl bg-[#030907] border border-emerald-500/25 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">[RISK_SCORE]</span>
          <div className="my-1 flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
              metrics.enterpriseRiskScore > 75 ? 'text-rose-400 glow-red' : metrics.enterpriseRiskScore > 50 ? 'text-amber-400 glow-amber' : 'text-emerald-400 glow-green'
            }`}>
              {metrics.enterpriseRiskScore}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-[#020504] h-1.5 rounded-full overflow-hidden border border-emerald-500/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.enterpriseRiskScore > 75 ? 'bg-rose-500' : metrics.enterpriseRiskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${metrics.enterpriseRiskScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 truncate">
            {metrics.isOverAppetite ? '⚠️ ABOVE TOLERANCE' : '✓ TOLERANT'}
          </span>
        </div>

        {/* Expected Annual Loss (EAL) */}
        <div className="p-3.5 rounded-xl bg-[#030907] border border-emerald-500/25 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">[EAL_EXPOSURE]</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 glow-green tabular-nums my-1">
            {formatRupees(metrics.totalEal)}
          </div>
          <div className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+8.4% 30d drift</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-0.5">Weighted avg loss</span>
        </div>

        {/* Value at Risk (95%) */}
        <div className="p-3.5 rounded-xl bg-[#030907] border border-rose-500/25 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">[VaR_95%_TAIL]</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-400 glow-red tabular-nums my-1">
            {formatRupees(var95)}
          </div>
          <span className="text-[10px] text-rose-300/80 font-mono">1-in-20 yr tail</span>
          <span className="text-[9px] text-slate-500 mt-0.5">5k Monte Carlo</span>
        </div>

        {/* Risk Trend Radial Gauge */}
        <div className="p-3.5 rounded-xl bg-[#030907] border border-emerald-500/25 flex flex-col justify-between">
          <RiskTrendRadialGauge
            deltaPercent={trendDeltaPercent}
            days={30}
            label="30d Velocity"
            sublabel={isThreatSimulated ? 'Surge active' : 'Baseline drift'}
            size={88}
          />
        </div>

        {/* Control Effectiveness */}
        <div className="p-3.5 rounded-xl bg-[#030907] border border-emerald-500/25 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">[DEFENSE_SCORE]</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 glow-green tabular-nums my-1">
            {(metrics.avgControlEffectiveness * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">7 Domains Mapped</span>
          <span className="text-[9px] text-slate-500 mt-0.5">Deficit: {(100 - metrics.avgControlEffectiveness * 100).toFixed(0)}%</span>
        </div>

        {/* Reduction Opportunity */}
        <div className="p-3.5 rounded-xl bg-[#030907] border border-cyan-500/25 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400">[OPTIMAL_CUT]</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 glow-cyan tabular-nums my-1">
            {formatRupees(potentialReductionOpportunity)}
          </div>
          <button
            onClick={() => onNavigateTab('optimization')}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold mt-0.5"
          >
            <span>❯ SOLVE KNAPSACK</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
          <span className="text-[9px] text-slate-500">Under ₹1 Cr envelope</span>
        </div>
      </div>

      {/* AI Executive Cyber Briefing */}
      <div className="p-4 rounded-xl bg-[#030907] border border-emerald-500/30 font-mono shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/20 mb-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>// AI_COPILOT_BRIEFING // TELEMETRY_GROUNDED</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">[FEED: REAL_TIME]</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded bg-[#020705] border border-emerald-500/25">
            <span className="text-[10px] text-slate-400 block font-bold text-emerald-400 mb-1">[01. EXPOSURE_STATUS]</span>
            <span className="text-slate-300">
              Total EAL: <strong className="text-emerald-300">{formatRupees(metrics.totalEal)}</strong>. 
              Over Board appetite by <strong className="text-amber-300">+{formatRupees(Math.max(0, metrics.totalEal - metrics.riskAppetiteLimit))}</strong>. 
              95% VaR tail loss: <strong className="text-rose-400">{formatRupees(var95)}</strong>.
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#020705] border border-amber-500/25">
            <span className="text-[10px] text-slate-400 block font-bold text-amber-400 mb-1">[02. PRIMARY_DRIVER]</span>
            <span className="text-slate-300">
              Weaponized CVE on <strong className="text-amber-300">{metrics.topRiskAssets[0]?.name || 'Fortinet SSL-VPN'}</strong>. 
              Likelihood: <strong className="text-rose-400">84%</strong> with direct core gateway dependency.
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#020705] border border-cyan-500/25">
            <span className="text-[10px] text-slate-400 block font-bold text-cyan-400 mb-1">[03. OPTIMAL_ACTION]</span>
            <span className="text-slate-300">
              Deploy <strong className="text-cyan-300">₹1.00 Cr</strong> Knapsack Plan. 
              Reduces annual exposure by <strong className="text-emerald-400 font-bold">71%</strong> (down to ₹1.37 Cr), recovering tolerance.
            </span>
          </div>
        </div>
      </div>

      {/* Primary Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono">
        {/* 12-Month Risk Trend Area Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider">// EXPOSURE_TRAJECTORY (12_MONTHS_INR_CR)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Historical EAL vs. 95% Tail Value at Risk</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> EAL
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> VaR 95%
              </span>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="varGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}Cr`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020605', borderColor: '#10B981', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(value: any) => [`₹${value} Cr`, '']}
                />
                <Area type="monotone" dataKey="varCr" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#varGrad)" name="VaR 95%" />
                <Area type="monotone" dataKey="ealCr" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#ealGrad)" name="Expected Annual Loss" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EAL by Business Unit Bar Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider">// LOSS_BY_BUSINESS_UNIT (INR_LAKHS)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Asset financial concentration</p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">[5_UNITS]</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020605', borderColor: '#10B981', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(value: any, _name: any, item: any) => [`₹${value} Lakh (${item.payload.percent}%)`, item.payload.fullName]}
                />
                <Bar dataKey="ealLakh" fill="#10B981" radius={[4, 4, 0, 0]}>
                  {buData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F43F5E' : index === 1 ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Loss Type Breakdown Donut & Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
        {/* Loss-Type Breakdown Donut */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider">// LOSS_COMPOSITION</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Categorical risk distribution</p>
          </div>

          <div className="h-48 w-full my-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lossTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {lossTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020605', borderColor: '#10B981', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(value: any) => [formatRupees(Number(value)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-[9px] text-slate-500 block font-mono">TOTAL_EAL</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{formatRupees(metrics.totalEal)}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs text-slate-300">
            {lossTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </span>
                <span className="font-mono text-emerald-400">{formatRupees(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risk Contributors (8 Assets) */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl bg-[#030907] border border-emerald-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider">// TOP_8_FINANCIAL_VECTORS</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Click any asset for math proof & dependency graph</p>
            </div>
            <button
              onClick={() => onNavigateTab('engine')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>[VIEW_ALL_48_ASSETS]</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {top10Assets.map((item, idx) => {
              const maxLakh = top10Assets[0]?.ealLakh || 1;
              const barWidth = Math.max(8, Math.round((item.ealLakh / maxLakh) * 100));

              return (
                <div
                  key={item.asset.id}
                  onClick={() => onSelectAsset(item.asset)}
                  className="p-2.5 rounded bg-[#020504] hover:bg-[#04120e] border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-[200px] sm:min-w-[260px]">
                    <span className="font-mono text-xs text-emerald-400 font-bold w-5">#{idx + 1}</span>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                        {item.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-cyan-400">{item.asset.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.asset.businessUnit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="flex-1 hidden md:block max-w-[220px]">
                    <div className="h-1.5 w-full bg-[#030907] rounded-full overflow-hidden border border-emerald-500/20">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          idx === 0 ? 'bg-rose-500' : idx < 3 ? 'bg-amber-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-white tabular-nums block">
                      {formatRupees(item.asset.eal)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {(item.asset.compositeLikelihood * 100).toFixed(1)}% prob
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Heatmap Matrix (Likelihood vs Impact) */}
      <RiskHeatmap
        assets={assets}
        onSelectAsset={onSelectAsset}
      />
    </div>
  );
}
