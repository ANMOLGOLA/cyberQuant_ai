import { Asset, BusinessUnit, ScenarioParams, Vulnerability, SecurityControl } from '../types';
import { ORG_METRICS } from '../data/mockData';

export interface CalculatedAsset extends Asset {
  compositeLikelihood: number;
  compositeImpact: number;
  eal: number;
  lossBreakdown: {
    downtime: number;
    dataBreach: number;
    regulatory: number;
    reputational: number;
  };
  calculationDetails: {
    baseExploitProbabilities: number[];
    threatMultipliers: number[];
    exposureMultiplier: number;
    controlDeficit: number;
    individualProbabilities: number[];
    downtimeLoss: number;
    breachLoss: number;
    regulatoryLoss: number;
    reputationalLoss: number;
    criticalityMultiplier: number;
  };
}

export interface EnterpriseRiskMetrics {
  totalEal: number;
  enterpriseRiskScore: number; // 0 to 100
  totalAssetsCount: number;
  criticalAssetsCount: number;
  highRiskAssetsCount: number;
  avgControlEffectiveness: number;
  riskAppetiteLimit: number;
  isOverAppetite: boolean;
  businessUnitBreakdown: {
    businessUnit: BusinessUnit;
    eal: number;
    percentOfTotal: number;
    assetCount: number;
    riskScore: number;
  }[];
  lossTypeBreakdown: {
    downtime: number;
    dataBreach: number;
    regulatory: number;
    reputational: number;
  };
  topRiskAssets: CalculatedAsset[];
  totalVulnerabilitiesCount: number;
  criticalVulnerabilitiesCount: number;
}

/**
 * Currency formatter for Indian Rupees
 * Formats accurately in Crores (Cr) and Lakhs (L)
 */
export function formatRupees(amount: number, compact: boolean = true): string {
  if (isNaN(amount) || amount === 0) return '₹0';

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (compact) {
    if (abs >= 10000000) {
      // 1 Crore = 10,000,000
      const cr = (abs / 10000000).toFixed(2);
      return `${sign}₹${cr} Cr`;
    }
    if (abs >= 100000) {
      // 1 Lakh = 100,000
      const lakh = (abs / 100000).toFixed(2);
      return `${sign}₹${lakh} Lakh`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma separator notation (e.g. 1,23,45,678)
  const parts = Math.round(abs).toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${sign}₹${formatted}`;
}

/**
 * Calculates effective control score for an asset taking into account active scenario adjustments
 */
export function calculateControlEffectiveness(
  controls: SecurityControl[],
  scenario?: Partial<ScenarioParams>
): number {
  if (!controls || controls.length === 0) return 0.2; // default fallback

  let totalScore = 0;
  for (const c of controls) {
    let eff = c.effectiveness;

    // Apply scenario multipliers to relevant control categories
    if (scenario) {
      if (c.category === 'IAM' && scenario.mfaPrivilegedPercent !== undefined) {
        // Base is ~50%, scaling to 95% at 100% MFA
        const mfaBonus = (scenario.mfaPrivilegedPercent / 100) * 0.45;
        eff = Math.min(0.98, eff + mfaBonus);
      }
      if (c.category === 'Perimeter' && scenario.networkSegmentationPercent !== undefined) {
        const segBonus = (scenario.networkSegmentationPercent / 100) * 0.35;
        eff = Math.min(0.98, eff + segBonus);
      }
      if (c.category === 'Endpoint' && scenario.edrCoveragePercent !== undefined) {
        const edrBonus = (scenario.edrCoveragePercent / 100) * 0.35;
        eff = Math.min(0.98, eff + edrBonus);
      }
    }

    totalScore += eff;
  }

  return Number((totalScore / controls.length).toFixed(3));
}

/**
 * Quantifies a single asset's likelihood, impact, and Expected Annual Loss (EAL)
 */
export function quantifyAsset(
  asset: Asset,
  scenario?: Partial<ScenarioParams>,
  activeThreatMultiplier: number = 1.0
): CalculatedAsset {
  const controlEff = calculateControlEffectiveness(asset.controls, scenario);
  const controlDeficit = Math.max(0.04, 1 - controlEff);
  const exposureFactor = asset.isInternetFacing ? 1.6 : 0.75;

  // Remediation delay penalty
  const delayFactor = scenario?.remediationDelayDays
    ? 1 + (scenario.remediationDelayDays / 30) * 0.25
    : 1.0;

  // Patching rate modifier
  const patchMultiplier = scenario?.criticalPatchRatePercent !== undefined
    ? Math.max(0.12, 1 - (scenario.criticalPatchRatePercent / 100) * 0.75)
    : 1.0;

  const baseProbs: number[] = [];
  const threatMults: number[] = [];
  const individualProbs: number[] = [];

  let nonExploitProduct = 1.0;

  if (asset.vulnerabilities && asset.vulnerabilities.length > 0) {
    for (const vuln of asset.vulnerabilities) {
      // Base probability mapped from EPSS and CVSS
      const baseProb = Math.min(0.95, (vuln.epss * 0.6) + ((vuln.cvss / 10) * 0.4));
      baseProbs.push(baseProb);

      // Threat activity multiplier
      let threatMult = vuln.threatIntelActive ? 1.85 : 1.1;
      if (vuln.cisaKev) threatMult *= 1.35;
      threatMult *= activeThreatMultiplier;
      threatMults.push(threatMult);

      // Single vulnerability exploit probability
      const p_i = Math.min(
        0.98,
        baseProb * threatMult * exposureFactor * controlDeficit * delayFactor * patchMultiplier
      );
      individualProbs.push(p_i);

      nonExploitProduct *= (1 - p_i);
    }
  } else {
    // Base probability for asset without known CVEs (zero-day/misconfig background risk)
    const baseP = 0.05 * exposureFactor * controlDeficit * delayFactor * activeThreatMultiplier;
    baseProbs.push(0.05);
    threatMults.push(1.0);
    individualProbs.push(baseP);
    nonExploitProduct = 1 - baseP;
  }

  // Composite Likelihood P = 1 - Product(1 - p_i)
  const compositeLikelihood = Math.min(0.98, Math.max(0.01, 1 - nonExploitProduct));

  // IMPACT COMPUTATION:
  // 1. Downtime cost = hours * hourly revenue * dependency weight
  const dependencyWeight = 1.0 + (asset.downstreamDependencies.length * 0.35);
  let effectiveDowntimeHours = asset.downtimeHoursEstimate;
  if (scenario?.edrCoveragePercent && scenario.edrCoveragePercent > 80) {
    // High EDR coverage accelerates containment
    effectiveDowntimeHours *= 0.65;
  }
  const downtimeLoss = effectiveDowntimeHours * asset.hourlyRevenueDependency * dependencyWeight;

  // 2. Data breach cost = records * cost/record (Indian baseline ₹280 per compromised financial record)
  const costPerRecord = 280;
  const breachLoss = asset.dataRecordsCount * costPerRecord;

  // 3. Regulatory penalty = scaled by jurisdiction & record sensitivity
  let regulatoryLoss = 0;
  if (asset.regulatoryJurisdiction === 'RBI') {
    regulatoryLoss = Math.min(100000000, 15000000 + (asset.criticality * 5000000)); // ₹1.5 Cr to ₹4.0 Cr
  } else if (asset.regulatoryJurisdiction === 'SEBI') {
    regulatoryLoss = Math.min(120000000, 20000000 + (asset.criticality * 6000000));
  } else if (asset.regulatoryJurisdiction === 'DPDP Act') {
    // DPDP Act permits up to ₹250 Cr; realistic estimate for mid-tier incident: ₹2.5 Cr - ₹8 Cr
    regulatoryLoss = Math.min(80000000, 25000000 + (asset.dataRecordsCount > 1000000 ? 30000000 : 10000000));
  } else {
    regulatoryLoss = 18000000;
  }

  // 4. Reputational loss = % of annual revenue scaled by criticality
  const reputationalLoss = (ORG_METRICS.annualRevenue * 0.0012) * (asset.criticality / 5);

  // Criticality multiplier: Level 1 = 0.8x, Level 5 = 1.6x
  const criticalityMultiplier = 0.6 + (asset.criticality * 0.2);

  const rawTotalImpact = (downtimeLoss + breachLoss + regulatoryLoss + reputationalLoss) * criticalityMultiplier;
  const compositeImpact = Math.round(rawTotalImpact);

  // Expected Annual Loss (EAL) = Likelihood * Impact
  const eal = Math.round(compositeLikelihood * compositeImpact);

  // Determine risk level category
  let riskLevel: Asset['riskLevel'] = 'Low';
  if (eal >= 5000000) riskLevel = 'Critical'; // >= ₹50 L
  else if (eal >= 2000000) riskLevel = 'High'; // >= ₹20 L
  else if (eal >= 500000) riskLevel = 'Medium'; // >= ₹5 L

  return {
    ...asset,
    likelihood: Number(compositeLikelihood.toFixed(4)),
    impact: compositeImpact,
    eal,
    riskLevel,
    lossBreakdown: {
      downtime: Math.round(downtimeLoss * criticalityMultiplier),
      dataBreach: Math.round(breachLoss * criticalityMultiplier),
      regulatory: Math.round(regulatoryLoss * criticalityMultiplier),
      reputational: Math.round(reputationalLoss * criticalityMultiplier),
    },
    compositeLikelihood: Number(compositeLikelihood.toFixed(4)),
    compositeImpact,
    calculationDetails: {
      baseExploitProbabilities: baseProbs,
      threatMultipliers: threatMults,
      exposureMultiplier: exposureFactor,
      controlDeficit,
      individualProbabilities: individualProbs,
      downtimeLoss,
      breachLoss,
      regulatoryLoss,
      reputationalLoss,
      criticalityMultiplier,
    },
  };
}

/**
 * Calculates aggregate risk across the entire enterprise
 */
export function quantifyEnterpriseRisk(
  assets: Asset[],
  scenario?: Partial<ScenarioParams>,
  activeThreatMultiplier: number = 1.0
): {
  calculatedAssets: CalculatedAsset[];
  metrics: EnterpriseRiskMetrics;
} {
  const calculatedAssets = assets.map((a) => quantifyAsset(a, scenario, activeThreatMultiplier));

  // Sort by EAL descending
  calculatedAssets.sort((a, b) => b.eal - a.eal);

  const totalEal = calculatedAssets.reduce((sum, a) => sum + a.eal, 0);

  // Enterprise Risk Score (0-100)
  // Normalized sigmoid curve against risk appetite limit (₹5.0 Cr)
  const appetiteLimit = ORG_METRICS.riskAppetiteLimit;
  const ratio = totalEal / appetiteLimit;
  // If totalEal == appetiteLimit (ratio = 1.0), score is ~70. If ratio is 0.5, score is ~42. If ratio is 1.5, score is ~88.
  const scoreRaw = 100 / (1 + Math.exp(-2.2 * (ratio - 0.72)));
  const enterpriseRiskScore = Math.min(99, Math.max(12, Math.round(scoreRaw)));

  // Count metrics
  let criticalAssetsCount = 0;
  let highRiskAssetsCount = 0;
  let totalControlScore = 0;
  let totalVulns = 0;
  let criticalVulns = 0;

  const lossTypeBreakdown = {
    downtime: 0,
    dataBreach: 0,
    regulatory: 0,
    reputational: 0,
  };

  const buMap: Record<BusinessUnit, { eal: number; count: number; controlTotal: number }> = {
    'Retail Banking': { eal: 0, count: 0, controlTotal: 0 },
    'Payments/UPI': { eal: 0, count: 0, controlTotal: 0 },
    'Trading Platform': { eal: 0, count: 0, controlTotal: 0 },
    'HR and Corporate IT': { eal: 0, count: 0, controlTotal: 0 },
    'Cloud/DevOps': { eal: 0, count: 0, controlTotal: 0 },
  };

  calculatedAssets.forEach((a) => {
    if (a.riskLevel === 'Critical') criticalAssetsCount++;
    if (a.riskLevel === 'High') highRiskAssetsCount++;

    const ctrlEff = calculateControlEffectiveness(a.controls, scenario);
    totalControlScore += ctrlEff;

    // Loss breakdown weighted by asset likelihood
    lossTypeBreakdown.downtime += Math.round(a.lossBreakdown.downtime * a.likelihood);
    lossTypeBreakdown.dataBreach += Math.round(a.lossBreakdown.dataBreach * a.likelihood);
    lossTypeBreakdown.regulatory += Math.round(a.lossBreakdown.regulatory * a.likelihood);
    lossTypeBreakdown.reputational += Math.round(a.lossBreakdown.reputational * a.likelihood);

    buMap[a.businessUnit].eal += a.eal;
    buMap[a.businessUnit].count += 1;
    buMap[a.businessUnit].controlTotal += ctrlEff;

    if (a.vulnerabilities) {
      totalVulns += a.vulnerabilities.length;
      criticalVulns += a.vulnerabilities.filter((v) => v.cvss >= 9.0).length;
    }
  });

  const businessUnitBreakdown = Object.entries(buMap).map(([bu, data]) => {
    const unitScore = Math.min(99, Math.max(15, Math.round((data.eal / (totalEal || 1)) * 140)));
    return {
      businessUnit: bu as BusinessUnit,
      eal: data.eal,
      percentOfTotal: totalEal > 0 ? Number(((data.eal / totalEal) * 100).toFixed(1)) : 0,
      assetCount: data.count,
      riskScore: unitScore,
    };
  });

  return {
    calculatedAssets,
    metrics: {
      totalEal,
      enterpriseRiskScore,
      totalAssetsCount: calculatedAssets.length,
      criticalAssetsCount,
      highRiskAssetsCount,
      avgControlEffectiveness: Number((totalControlScore / calculatedAssets.length).toFixed(3)),
      riskAppetiteLimit: appetiteLimit,
      isOverAppetite: totalEal > appetiteLimit,
      businessUnitBreakdown,
      lossTypeBreakdown,
      topRiskAssets: calculatedAssets.slice(0, 10),
      totalVulnerabilitiesCount: totalVulns,
      criticalVulnerabilitiesCount: criticalVulns,
    },
  };
}
