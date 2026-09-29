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
    <header className="sticky top-0 z-40 w-full bg-[#050B18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 text-left text-white group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-none">
              CyberQuant<span className="text-cyan-400"> AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide block mt-0.5">
              Financial Risk Intelligence
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer relative ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Telemetry State */}
        <div className="flex items-center gap-3">
          {/* Telemetry ticker */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Telemetry: {secondsAgo}s ago</span>
          </div>

          {/* Org context indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Org:</span>
            <span className="font-semibold text-slate-200">{ORG_METRICS.name}</span>
          </div>

          {/* Simulate Threat Button */}
          <button
            onClick={onSimulateThreat}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              isThreatSimulated
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700'
            }`}
            title="Simulate a real-time high-severity threat event across the enterprise"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap">
              {isThreatSimulated ? 'Reset Threat' : 'Simulate Threat'}
            </span>
          </button>

          {/* Architecture Modal Button */}
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="View Architecture Pipeline Diagram"
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Guided Tour Trigger */}
          <button
            onClick={onOpenTour}
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo Tour</span>
          </button>
        </div>
      </div>
    </header>
  );
}
