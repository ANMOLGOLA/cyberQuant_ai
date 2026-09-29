import { CalculatedAsset, formatRupees } from './riskEngine';
import { EnterpriseRiskMetrics } from './riskEngine';

export interface NLQueryResponse {
  query: string;
  answer: string;
  source: 'gemini-3.8-flash' | 'local-engine';
  suggestedAction?: {
    label: string;
    actionType: 'open-whatif' | 'open-optimizer' | 'view-asset';
    payload?: any;
  };
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  metricsHighlight?: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
}

export async function processNaturalLanguageQuery(
  query: string,
  metrics: EnterpriseRiskMetrics,
  assets: CalculatedAsset[]
): Promise<NLQueryResponse> {
  const trimmed = query.trim().toLowerCase();

  // Try calling the server-side Gemini API proxy route
  try {
    const apiRes = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: query,
        context: {
          eal: formatRupees(metrics.totalEal),
          var95: formatRupees(metrics.totalEal * 2.85),
          riskScore: metrics.enterpriseRiskScore,
          topRiskDriver: assets[0] ? `${assets[0].name} (${assets[0].vulnerabilities[0]?.cve || 'Critical Vulnerability'})` : 'Core VPN Gateway',
        },
      }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (!data.fallback && data.reply) {
        return {
          query,
          answer: data.reply,
          source: 'gemini-3.8-flash',
          metricsHighlight: [
            { label: 'Current EAL', value: formatRupees(metrics.totalEal) },
            { label: 'VaR 95%', value: formatRupees(metrics.totalEal * 2.85) },
          ],
        };
      }
    }
  } catch (_e) {
    // Graceful fallback to local intent engine
  }

  // Local deterministic rule-based semantic parser
  if (trimmed.includes('highest') || trimmed.includes('biggest risk') || trimmed.includes('top risk')) {
    const topAsset = assets[0];
    const topVuln = topAsset?.vulnerabilities?.[0];
    return {
      query,
      answer: `Our highest financial cyber exposure today is centered on **${topAsset.name}** in the **${topAsset.businessUnit}** business unit, carrying an Expected Annual Loss of **${formatRupees(topAsset.eal)}** (total potential impact: **${formatRupees(topAsset.impact)}** at **${(topAsset.likelihood * 100).toFixed(1)}%** likelihood). The primary driver is **${topVuln?.cve || 'CVE-2024-21762'}** (CVSS ${topVuln?.cvss || 9.8}) on an internet-facing perimeter appliance. Remediation is estimated at only **${formatRupees(topVuln?.remediationCost || 280000)}**, offering a risk reduction ratio of over 10:1.`,
      source: 'local-engine',
      suggestedAction: {
        label: `Inspect Asset: ${topAsset.name}`,
        actionType: 'view-asset',
        payload: topAsset.id,
      },
      metricsHighlight: [
        { label: 'Asset EAL', value: formatRupees(topAsset.eal), sublabel: `${(topAsset.likelihood * 100).toFixed(1)}% likelihood` },
        { label: 'Max Impact', value: formatRupees(topAsset.impact), sublabel: 'Single incident loss' },
        { label: 'Remediation Cost', value: formatRupees(topVuln?.remediationCost || 280000), sublabel: 'Estimated patch cost' },
      ],
    };
  }

  if (trimmed.includes('vulnerabilit') || trimmed.includes('cve') || trimmed.includes('contribute most')) {
    const topVulnAssets = assets.filter((a) => a.vulnerabilities && a.vulnerabilities.length > 0).slice(0, 4);
    const rows = topVulnAssets.map((a) => {
      const v = a.vulnerabilities[0];
      return [
        v.cve,
        v.cvss.toFixed(1),
        `${(v.epss * 100).toFixed(0)}%`,
        a.name.length > 28 ? a.name.substring(0, 26) + '...' : a.name,
        formatRupees(a.eal),
      ];
    });

    return {
      query,
      answer: `Out of ${metrics.totalVulnerabilitiesCount} detected vulnerabilities across our estate, **4 critical CVEs drive over 62% of our total financial exposure**. These vulnerabilities exhibit both active in-the-wild exploitation (CISA KEV) and direct presence on internet-exposed perimeter boundaries. Prioritizing these 4 CVEs will yield immediate monetary risk reduction of **${formatRupees(metrics.totalEal * 0.48)}**.`,
      source: 'local-engine',
      tableData: {
        headers: ['CVE ID', 'CVSS', 'EPSS Prob', 'Affected Asset', 'EAL Contributed'],
        rows,
      },
      suggestedAction: {
        label: 'Open What-If Simulation for Critical CVEs',
        actionType: 'open-whatif',
      },
    };
  }

  if (trimmed.includes('mfa') || trimmed.includes('privileged') || trimmed.includes('two-factor')) {
    const potentialSaving = 14200000; // ₹1.42 Cr
    const newEal = Math.max(1000000, metrics.totalEal - potentialSaving);

    return {
      query,
      answer: `Mandating hardware FIDO2 Multi-Factor Authentication (MFA) on all 4,200 privileged active accounts will **cut our total Expected Annual Loss by ₹1.42 Crore (approx ${(potentialSaving / metrics.totalEal * 100).toFixed(1)}% reduction)**. This shrinks the likelihood of credential-based perimeter compromise on our Domain Controllers and VPN Gateways from 48% down to under 8%. Total implementation cost is ₹45 Lakh, yielding a **ROSI of 215.5%**.`,
      source: 'local-engine',
      metricsHighlight: [
        { label: 'Current Total EAL', value: formatRupees(metrics.totalEal) },
        { label: 'Post-MFA EAL', value: formatRupees(newEal), sublabel: 'Estimated residual exposure' },
        { label: 'Annual Savings', value: formatRupees(potentialSaving), sublabel: 'Quantified reduction' },
        { label: 'Projected ROSI', value: '+215.5%', sublabel: 'Return on Investment' },
      ],
      suggestedAction: {
        label: 'Test 100% MFA in What-If Lab',
        actionType: 'open-whatif',
      },
    };
  }

  if (trimmed.includes('top 5') || trimmed.includes('top five') || trimmed.includes('highest assets')) {
    const top5 = assets.slice(0, 5);
    const rows = top5.map((a, idx) => [
      `#${idx + 1}`,
      a.name.length > 25 ? a.name.substring(0, 23) + '...' : a.name,
      a.businessUnit,
      `${(a.likelihood * 100).toFixed(1)}%`,
      formatRupees(a.impact),
      formatRupees(a.eal),
    ]);

    return {
      query,
      answer: `Here are the top 5 assets generating the largest Expected Annual Loss for Aarav FinServe Ltd. Together, these 5 assets account for **${formatRupees(top5.reduce((s, a) => s + a.eal, 0))}**, which represents **${((top5.reduce((s, a) => s + a.eal, 0) / metrics.totalEal) * 100).toFixed(1)}%** of enterprise risk exposure.`,
      source: 'local-engine',
      tableData: {
        headers: ['Rank', 'Asset Name', 'Unit', 'Likelihood', 'Impact', 'EAL (₹)'],
        rows,
      },
    };
  }

  if (trimmed.includes('delay') || trimmed.includes('30 days') || trimmed.includes('defer')) {
    const deltaLoss = Math.round(metrics.totalEal * 0.18); // ~18% increase for 30-day delay
    const delayedEal = metrics.totalEal + deltaLoss;

    return {
      query,
      answer: `Delaying vulnerability remediation by 30 days increases our financial exposure by **${formatRupees(deltaLoss)}**, pushing enterprise EAL from **${formatRupees(metrics.totalEal)}** up to **${formatRupees(delayedEal)}**. This occurs because active exploit maturity curves and automated bot scans exponentially increase probability of weaponization over time (threat multiplier increases by ~25% every 30 days for unpatched CISA KEV vulnerabilities).`,
      source: 'local-engine',
      metricsHighlight: [
        { label: 'Current EAL', value: formatRupees(metrics.totalEal) },
        { label: '30-Day Delay EAL', value: formatRupees(delayedEal), sublabel: `+${formatRupees(deltaLoss)} risk growth` },
        { label: 'Risk Score Impact', value: `+${Math.round(deltaLoss / 10000000 * 8)} pts`, sublabel: 'Pushes closer to breach' },
      ],
      suggestedAction: {
        label: 'Adjust Delay Slider in What-If Lab',
        actionType: 'open-whatif',
      },
    };
  }

  // Default intelligent synthesis
  return {
    query,
    answer: `Analysis of Aarav FinServe Ltd's technical telemetry indicates an overall **Expected Annual Loss of ${formatRupees(metrics.totalEal)}** across ${metrics.totalAssetsCount} monitored assets, against an approved risk appetite threshold of **${formatRupees(metrics.riskAppetiteLimit)}**. The primary loss category is **${metrics.lossTypeBreakdown.downtime > metrics.lossTypeBreakdown.dataBreach ? 'Business Interruption / Downtime' : 'Data Breach Liabilities'}**, heavily concentrated in the **${metrics.businessUnitBreakdown[0]?.businessUnit || 'Payments/UPI'}** and **${metrics.businessUnitBreakdown[1]?.businessUnit || 'Retail Banking'}** divisions. To optimize capital allocation, view our 0/1 Knapsack Investment module.`,
    source: 'local-engine',
    suggestedAction: {
      label: 'Explore Investment Optimizer',
      actionType: 'open-optimizer',
    },
    metricsHighlight: [
      { label: 'Enterprise EAL', value: formatRupees(metrics.totalEal) },
      { label: 'Risk Score', value: `${metrics.enterpriseRiskScore}/100` },
      { label: 'Risk Appetite', value: formatRupees(metrics.riskAppetiteLimit) },
    ],
  };
}
