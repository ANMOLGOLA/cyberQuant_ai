import { CandidateControlProject, OptimizationResult } from '../types';
import { CANDIDATE_PROJECTS } from '../data/mockData';

/**
 * 0/1 Knapsack dynamic programming / branch-and-bound optimization
 * Selects candidate security projects that maximize total risk reduction
 * without exceeding the allocated budget.
 */
export function solveSecurityInvestmentKnapsack(
  projects: CandidateControlProject[],
  budget: number,
  currentEal: number
): OptimizationResult {
  // Scale units to Lakhs (100,000 INR) for DP matrix performance
  const UNIT = 100000;
  const W = Math.max(1, Math.floor(budget / UNIT));
  const n = projects.length;

  const weights = projects.map((p) => Math.max(1, Math.round(p.cost / UNIT)));
  const values = projects.map((p) => Math.round(p.riskReduction / UNIT));

  // DP table: dp[i][w] stores max value using subset of first i items with weight limit w
  // To keep memory ultra-light and fast:
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];
    for (let w = 0; w <= W; w++) {
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + val);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find chosen items
  const selected: CandidateControlProject[] = [];
  let w = W;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(projects[i - 1]);
      w -= weights[i - 1];
    }
  }

  const totalCost = selected.reduce((sum, p) => sum + p.cost, 0);
  const totalRiskReduction = selected.reduce((sum, p) => sum + p.riskReduction, 0);
  const residualEal = Math.max(0, currentEal - totalRiskReduction);
  const overallRosi = totalCost > 0
    ? Number((((totalRiskReduction - totalCost) / totalCost) * 100).toFixed(1))
    : 0;

  // Generate the Frontier Curve: budgets from 0 to ₹4 Cr in steps of ₹20 L
  const frontierCurve: { budget: number; riskReduction: number; isOptimalKnee?: boolean }[] = [];
  const maxStep = 25;
  const stepSize = 1500000; // ₹15 Lakh steps

  let kneePointBudget = 10000000; // default ₹1 Cr
  let maxMarginalGain = 0;
  let prevVal = 0;

  for (let s = 0; s <= maxStep; s++) {
    const testBudget = s * stepSize;
    const testW = Math.floor(testBudget / UNIT);
    let bestVal = 0;
    if (testW <= W) {
      bestVal = dp[n][testW] * UNIT;
    } else {
      // Greedily approximate if above current W
      bestVal = projects
        .slice()
        .sort((a, b) => (b.riskReduction / b.cost) - (a.riskReduction / a.cost))
        .reduce((acc, p) => {
          if (acc.cost + p.cost <= testBudget) {
            acc.cost += p.cost;
            acc.gain += p.riskReduction;
          }
          return acc;
        }, { cost: 0, gain: 0 }).gain;
    }

    const marginalGain = bestVal - prevVal;
    if (s > 1 && marginalGain > maxMarginalGain) {
      maxMarginalGain = marginalGain;
      kneePointBudget = testBudget;
    }
    prevVal = bestVal;

    frontierCurve.push({
      budget: testBudget,
      riskReduction: bestVal,
    });
  }

  // Mark optimal knee point
  frontierCurve.forEach((point) => {
    if (Math.abs(point.budget - kneePointBudget) < stepSize) {
      point.isOptimalKnee = true;
    }
  });

  return {
    budget,
    selectedProjects: selected,
    totalCost,
    totalRiskReduction,
    residualEal,
    overallRosi,
    frontierCurve,
  };
}

/**
 * Computes a baseline manual comparison plan
 */
export function computePlanComparisons(
  allProjects: CandidateControlProject[],
  optimizedResult: OptimizationResult,
  currentEal: number
) {
  // Do Nothing baseline
  const doNothing = {
    name: 'Do Nothing (Status Quo)',
    cost: 0,
    riskReduction: 0,
    residualEal: currentEal,
    rosi: 0,
    projectCount: 0,
    description: 'Maintain existing controls without budget allocation; risk increases due to unpatched CVEs.',
  };

  // Manual / Ad-hoc selection (picking top 2 expensive or popular projects up to budget)
  const manualSelected: CandidateControlProject[] = [];
  let manualSpend = 0;
  for (const p of [allProjects[0], allProjects[2], allProjects[7]]) {
    if (p && manualSpend + p.cost <= optimizedResult.budget) {
      manualSelected.push(p);
      manualSpend += p.cost;
    }
  }
  const manualReduction = manualSelected.reduce((sum, p) => sum + p.riskReduction, 0);
  const manualRosi = manualSpend > 0
    ? Number((((manualReduction - manualSpend) / manualSpend) * 100).toFixed(1))
    : 0;

  const manualPlan = {
    name: 'Ad-Hoc / Intuitive Plan',
    cost: manualSpend,
    riskReduction: manualReduction,
    residualEal: Math.max(0, currentEal - manualReduction),
    rosi: manualRosi,
    projectCount: manualSelected.length,
    description: 'Conventional selection without mathematical optimization, often missing high-ROSI controls.',
  };

  const optimizedPlan = {
    name: 'ArthaRisk Optimized',
    cost: optimizedResult.totalCost,
    riskReduction: optimizedResult.totalRiskReduction,
    residualEal: optimizedResult.residualEal,
    rosi: optimizedResult.overallRosi,
    projectCount: optimizedResult.selectedProjects.length,
    description: 'Mathematically optimal knapsack solution maximizing financial loss reduction per rupee spent.',
  };

  return { doNothing, manualPlan, optimizedPlan };
}
