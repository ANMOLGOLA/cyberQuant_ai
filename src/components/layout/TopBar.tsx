import { useState, useEffect } from 'react';
import { Shield, Sparkles, AlertOctagon, HelpCircle, Activity } from 'lucide-react';
import { ORG_METRICS } from '../../data/mockData';

interface TopBarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onSimulateThreat: () => void;
  onOpenTour: () => void;
  onOpenArchitecture: () => void;
  isThreatSimulated: boolean;
}

export function TopBar({
  activeTab,
  onSelectTab,
  onSimulateThreat,
  onOpenTour,
  onOpenArchitecture,
  isThreatSimulated,
}: TopBarProps) {
  const [secondsAgo, setSecondsAgo] = useState(4);

  // Live telemetry pulse ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 25 ? 2 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Executive Board' },
    { id: 'engine', label: 'Risk Engine' },
    { id: 'decision', label: 'AI Decision Lab' },
    { id: 'optimization', label: 'Optimization' },
    { id: 'compliance', label: 'Compliance' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030712]/95 backdrop-blur-md border-b border-emerald-500/25 px-3 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Terminal Identity */}
        <button
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded border border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm shadow-[0_0_10px_rgba(34,197,94,0.3)] group-hover:border-emerald-400 transition-colors">
            &gt;_
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm font-extrabold font-mono tracking-tight text-white glow-green">
                ARTHA<span className="text-emerald-400">RISK</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono">
                SEC_NODE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
              QUANT_RISK_FINANCE // INR
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links in Terminal Code Style */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-mono text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1 rounded transition-all cursor-pointer font-mono ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(34,197,94,0.15)] font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {isActive ? `> ${item.label}` : item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Telemetry Stream & Primary Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live stream ticker */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-emerald-400 px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider">FEED_ACTIVE: -{secondsAgo}s</span>
          </div>

          {/* Org tag */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-slate-300 px-2 py-1 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500">TARGET:</span>
            <span className="text-slate-300 font-medium truncate max-w-[120px]">{ORG_METRICS.name}</span>
          </div>

          {/* Threat Simulator Trigger */}
          <button
            onClick={onSimulateThreat}
            className={`px-2.5 py-1.5 text-[11px] font-mono font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer ${
              isThreatSimulated
                ? 'bg-rose-950/80 text-rose-300 border border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.35)] animate-pulse'
                : 'bg-slate-900 text-amber-300 border border-amber-500/40 hover:bg-amber-950/30'
            }`}
            title="Inject active CVE-2024-21762 zero-day payload into network"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap">
              {isThreatSimulated ? '[BREACH_ACTIVE]' : '[SIM_INJECT]'}
            </span>
          </button>

          {/* Architecture Pipeline Map */}
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors"
            title="Inspect Data Flow Topology"
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Guide Tour */}
          <button
            onClick={onOpenTour}
            className="px-3 py-1.5 text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-[0_0_12px_rgba(34,197,94,0.4)] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">TOUR_PROT</span>
          </button>
        </div>
      </div>
    </header>
  );
}
