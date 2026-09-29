import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RiskTrendRadialGaugeProps {
  deltaPercent: number; // e.g. +8.4 for worsening risk or -6.2 for improved risk
  days?: number;
  label?: string;
  sublabel?: string;
  size?: number; // size in pixels, default 110
}

export function RiskTrendRadialGauge({
  deltaPercent,
  days = 30,
  label = 'Risk Velocity',
  sublabel,
  size = 110,
}: RiskTrendRadialGaugeProps) {
  // Positive delta = risk increased (regression/danger)
  // Negative delta = risk decreased (improvement/safe)
  const isRegression = deltaPercent > 0.5;
  const isImprovement = deltaPercent < -0.5;
  const isNeutral = !isRegression && !isImprovement;

  // Normalized magnitude for radial progress: 0% to 25% mapped to 0 to 100% ring fill
  const absDelta = Math.abs(deltaPercent);
  const normalizedPercentage = Math.min(100, Math.max(8, (absDelta / 20) * 100));

  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;

  // Color dynamics:
  // Regression (risk increased) => bright red (#FF1744) to amber
  // Improvement (risk decreased) => vibrant emerald (#00E676)
  // Neutral => cyan (#00E5FF)
  const ringColor = useMemo(() => {
    if (isRegression) return '#FF1744';
    if (isImprovement) return '#00E676';
    return '#00E5FF';
  }, [isRegression, isImprovement]);

  const glowShadow = useMemo(() => {
    if (isRegression) return 'drop-shadow(0 0 6px rgba(255, 23, 68, 0.4))';
    if (isImprovement) return 'drop-shadow(0 0 6px rgba(0, 230, 118, 0.4))';
    return 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.4))';
  }, [isRegression, isImprovement]);

  return (
    <div className="flex flex-col items-center justify-between h-full text-center">
      <div className="flex items-center justify-between w-full text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span className="text-[10px] font-mono text-slate-500">{days}d Trend</span>
      </div>

      <div className="relative my-auto flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          style={{ filter: glowShadow }}
        >
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated dynamic progress ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center justify-center gap-0.5">
            {isRegression ? (
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            ) : isImprovement ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span
              className={`text-sm font-bold font-mono tabular-nums ${
                isRegression
                  ? 'text-rose-400'
                  : isImprovement
                  ? 'text-emerald-400'
                  : 'text-cyan-400'
              }`}
            >
              {deltaPercent > 0 ? `+${deltaPercent.toFixed(1)}` : deltaPercent.toFixed(1)}%
            </span>
          </div>

          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
            {isRegression ? 'Regression' : isImprovement ? 'Improved' : 'Stable'}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-mono mt-1 w-full text-center truncate">
        {sublabel || (isRegression ? 'Net exposure expanded' : isImprovement ? 'Risk exposure reduced' : 'Exposure unchanged')}
      </div>
    </div>
  );
}
