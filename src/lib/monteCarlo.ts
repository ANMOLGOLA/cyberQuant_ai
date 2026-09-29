import { CalculatedAsset } from './riskEngine';
import { MonteCarloResult, MonteCarloHistogramBin } from '../types';

/**
 * Standard normal random variable using Box-Muller transform
 */
function randomStandardNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * High-performance Monte Carlo Cyber Loss Simulation
 * Evaluates 5,000 iterations using Bernoulli draws for occurrence
 * and Lognormal draws for severity across all active enterprise assets.
 */
export function runMonteCarloSimulation(
  assets: CalculatedAsset[],
  iterations: number = 5000
): MonteCarloResult {
  const startTime = performance.now();

  const iterationLosses = new Float64Array(iterations);

  // Precompute lognormal parameters for each asset to maximize performance
  const assetParams = assets.map((a) => {
    const p = Math.max(0.005, Math.min(0.99, a.compositeLikelihood));
    const meanImpact = Math.max(100000, a.compositeImpact);
    const sigma = 0.42; // Volatility parameter
    const mu = Math.log(meanImpact) - (sigma * sigma) / 2;
    return { p, mu, sigma };
  });

  const numAssets = assetParams.length;

  for (let i = 0; i < iterations; i++) {
    let yearLoss = 0;

    for (let j = 0; j < numAssets; j++) {
      const { p, mu, sigma } = assetParams[j];
      // Bernoulli trial: did a breach/outage occur for this asset this year?
      if (Math.random() < p) {
        // Lognormal draw for loss severity
        const z = randomStandardNormal();
        const loss = Math.exp(mu + sigma * z);
        yearLoss += loss;
      }
    }

    iterationLosses[i] = yearLoss;
  }

  // Sort losses ascending for percentile calculation
  iterationLosses.sort();

  // Compute key percentiles
  const getPercentile = (pct: number) => {
    const index = Math.min(iterations - 1, Math.floor((pct / 100) * iterations));
    return iterationLosses[index];
  };

  const medianLoss = getPercentile(50);
  const var90 = getPercentile(90);
  const var95 = getPercentile(95);
  const var99 = getPercentile(99);
  const maxLoss = iterationLosses[iterations - 1];

  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += iterationLosses[i];
  }
  const meanLoss = sum / iterations;

  // Compute Standard Deviation
  let varSum = 0;
  for (let i = 0; i < iterations; i++) {
    const diff = iterationLosses[i] - meanLoss;
    varSum += diff * diff;
  }
  const stdDev = Math.sqrt(varSum / iterations);

  // Compute Conditional VaR (Expected Shortfall) at 95%
  const var95Index = Math.floor(0.95 * iterations);
  let tailSum = 0;
  let tailCount = 0;
  for (let i = var95Index; i < iterations; i++) {
    tailSum += iterationLosses[i];
    tailCount++;
  }
  const cvar95 = tailCount > 0 ? tailSum / tailCount : var95;

  // Build 25 histogram bins
  const binCount = 25;
  const minObserved = iterationLosses[0];
  const maxObserved = Math.min(var99 * 1.35, maxLoss); // Cap chart axis for clear visibility
  const binWidth = (maxObserved - minObserved) / binCount;

  const histogram: MonteCarloHistogramBin[] = [];
  const binCounts = new Array(binCount).fill(0);

  for (let i = 0; i < iterations; i++) {
    const val = iterationLosses[i];
    if (val >= maxObserved) {
      binCounts[binCount - 1]++;
    } else {
      const idx = Math.floor((val - minObserved) / binWidth);
      if (idx >= 0 && idx < binCount) {
        binCounts[idx]++;
      }
    }
  }

  for (let b = 0; b < binCount; b++) {
    const lossMin = minObserved + b * binWidth;
    const lossMax = lossMin + binWidth;
    const freq = binCounts[b];
    const rangeLabel = `₹${(lossMin / 10000000).toFixed(1)}-${(lossMax / 10000000).toFixed(1)} Cr`;

    histogram.push({
      rangeLabel,
      lossMin,
      lossMax,
      frequency: freq,
      probabilityDensity: Number((freq / iterations).toFixed(4)),
    });
  }

  const runTimeMs = Math.round(performance.now() - startTime);

  return {
    iterations,
    meanLoss: Math.round(meanLoss),
    medianLoss: Math.round(medianLoss),
    stdDev: Math.round(stdDev),
    var90: Math.round(var90),
    var95: Math.round(var95),
    var99: Math.round(var99),
    cvar95: Math.round(cvar95),
    maxLoss: Math.round(maxLoss),
    histogram,
    runTimeMs,
  };
}
