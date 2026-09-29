export type BusinessUnit = 
  | 'Retail Banking' 
  | 'Payments/UPI' 
  | 'Trading Platform' 
  | 'HR and Corporate IT' 
  | 'Cloud/DevOps';

export type AssetCriticality = 1 | 2 | 3 | 4 | 5;

export interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  cvss: number;
  epss: number; // Exploit Prediction Scoring System (0.01 - 0.95)
  threatIntelActive: boolean;
  cisaKev: boolean;
  publishedDate: string;
  affectedComponent: string;
  remediationCost: number; // in INR
}

export interface SecurityControl {
  id: string;
  name: string;
  category: 'IAM' | 'Perimeter' | 'Endpoint' | 'Cloud' | 'Application' | 'Data Protection';
  implementationStatus: 'Full' | 'Partial' | 'Missing';
  configurationStrength: number; // 0 to 1
  incidentHistoryScore: number; // 0 to 1
  complianceScore: number; // 0 to 1
  effectiveness: number; // calculated weighted 0 to 1
  frameworks: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'Database' | 'API Gateway' | 'Web App' | 'Server Cluster' | 'Cloud Storage' | 'Workstation Pool' | 'Network Appliance';
  businessUnit: BusinessUnit;
  criticality: AssetCriticality;
  isInternetFacing: boolean;
  dataRecordsCount: number; // e.g. customer accounts, financial records
  hourlyRevenueDependency: number; // in INR
  downtimeHoursEstimate: number;
  regulatoryJurisdiction: 'RBI' | 'SEBI' | 'DPDP Act' | 'Multi-Regulator';
  vulnerabilities: Vulnerability[];
  controls: SecurityControl[];
  upstreamDependencies: string[]; // Asset IDs
  downstreamDependencies: string[]; // Asset IDs
  lastScanTimestamp: string;
  owner: string;
  // Computed risk metrics
  likelihood: number; // 0 to 1
  impact: number; // Total potential loss in INR
  eal: number; // Expected Annual Loss in INR
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  lossBreakdown: {
    downtime: number;
    dataBreach: number;
    regulatory: number;
    reputational: number;
  };
}

export interface TelemetrySource {
  id: string;
  name: string;
  category: 'Vuln Mgmt' | 'SIEM' | 'IAM' | 'EDR' | 'CSPM' | 'CMDB' | 'Threat Intel';
  vendor: string;
  recordsIngested: number;
  status: 'Online' | 'Syncing' | 'Degraded';
  lastSync: string;
  latencyMs: number;
}

export interface MonteCarloHistogramBin {
  rangeLabel: string;
  lossMin: number;
  lossMax: number;
  frequency: number;
  probabilityDensity: number;
}

export interface MonteCarloResult {
  iterations: number;
  meanLoss: number; // EAL
  medianLoss: number;
  stdDev: number;
  var90: number;
  var95: number;
  var99: number;
  cvar95: number; // Expected Shortfall
  maxLoss: number;
  histogram: MonteCarloHistogramBin[];
  runTimeMs: number;
}

export interface CandidateControlProject {
  id: string;
  title: string;
  description: string;
  category: string;
  cost: number; // in INR
  riskReduction: number; // in INR EAL reduced
  effortWeeks: number;
  rosi: number; // (riskReduction - cost) / cost * 100
  affectedAssetIds: string[];
  frameworkCoverage: string[];
  dependencies?: string[];
  selected?: boolean;
}

export interface OptimizationResult {
  budget: number;
  selectedProjects: CandidateControlProject[];
  totalCost: number;
  totalRiskReduction: number;
  residualEal: number;
  overallRosi: number;
  frontierCurve: {
    budget: number;
    riskReduction: number;
    isOptimalKnee?: boolean;
  }[];
}

export interface ScenarioParams {
  mfaPrivilegedPercent: number; // 0 to 100
  criticalPatchRatePercent: number; // 0 to 100
  networkSegmentationPercent: number; // 0 to 100
  edrCoveragePercent: number; // 0 to 100
  remediationDelayDays: number; // 0 to 90
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: 'Zero-Day' | 'Ransomware Campaign' | 'Cloud Misconfiguration' | 'Credential Spill';
  title: string;
  targetAssets: string[];
  severity: 'Critical' | 'High' | 'Medium';
  impactMultiplier: number;
  description: string;
}

export interface FrameworkControl {
  id: string;
  code: string;
  title: string;
  domain: string;
  status: 'Compliant' | 'Partial' | 'Gap';
  evidenceCount: number;
  financialExposureGap: number; // in INR
  linkedAssetCount: number;
  remediationAction: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  version: string;
  regulatoryBody: string;
  overallComplianceScore: number;
  totalControls: number;
  compliantCount: number;
  partialCount: number;
  gapCount: number;
  domains: {
    name: string;
    score: number;
    totalControls: number;
  }[];
  controls: FrameworkControl[];
}
