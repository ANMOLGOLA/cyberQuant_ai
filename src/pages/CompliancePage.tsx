import { useState } from 'react';
import { COMPLIANCE_FRAMEWORKS } from '../data/mockData';
import { ComplianceFramework, FrameworkControl } from '../types';
import { formatRupees } from '../lib/riskEngine';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileCheck, 
  Shield, 
  Download, 
  ExternalLink, 
  Layers, 
  X 
} from 'lucide-react';

export function CompliancePage() {
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('FW-RBI');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const activeFramework = COMPLIANCE_FRAMEWORKS.find((f) => f.id === selectedFrameworkId) || COMPLIANCE_FRAMEWORKS[0];

  const domainChartData = activeFramework.domains.map((d) => ({
    name: d.name.length > 22 ? d.name.substring(0, 20) + '...' : d.name,
    fullName: d.name,
    score: d.score,
    controls: d.totalControls,
  }));

  // Cross-mapping matrix data
  const crossMappingRows = [
    {
      technicalControl: 'Hardware FIDO2 Multi-Factor Authentication',
      rbi: 'RBI CSF 5.1 (User Access Control)',
      sebi: 'SEBI CSCRF 4.1 (Access Mgmt)',
      nist: 'PR.AC-1 (Identity & Credentials)',
      iso: 'A.8.2 (Privileged Access)',
      status: 'Partial (45% -> Target 100%)',
      exposure: 14200000,
    },
    {
      technicalControl: 'Perimeter Microsegmentation & VPN ZTNA',
      rbi: 'RBI CSF 3.1 & 3.2 (Boundary Defense)',
      sebi: 'SEBI CSCRF Annexure B (Colo Isolation)',
      nist: 'PR.PT-4 (Network Protection)',
      iso: 'A.13.1 (Network Security)',
      status: 'Partial (VPN CVE-2024-21762)',
      exposure: 12800000,
    },
    {
      technicalControl: 'Database Activity Monitoring (DAM) & Masking',
      rbi: 'RBI CSF 6.4 (Database Audit)',
      sebi: 'SEBI CSCRF 3.2 (Audit Trails)',
      nist: 'DE.CM-1 (Audit Monitoring)',
      iso: 'A.12.3 (Cryptographic Keys)',
      status: 'Gap (Finacle Unmonitored)',
      exposure: 9800000,
    },
    {
      technicalControl: 'Automated 7-Day Vulnerability Patching SLA',
      rbi: 'RBI CSF 2.2 (Patch Management)',
      sebi: 'SEBI CSCRF 4.3 (Vulnerability Mgmt)',
      nist: 'PR.IP-12 (Vulnerability Mgmt)',
      iso: 'A.8.8 (Tech Vulnerabilities)',
      status: 'Partial (Average SLA 24 days)',
      exposure: 8900000,
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Regulatory & Compliance Audit Mapping</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-mono">Financial Gap Attribution</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Framework Compliance & Audit Readiness
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Translates regulatory circulars into continuous evidence audits, connecting each compliance gap directly to quantified monetary exposure in Rupees.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <FileCheck className="w-4 h-4" />
          <span>Generate Audit / Regulatory Report</span>
        </button>
      </div>

      {/* Framework Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
        {COMPLIANCE_FRAMEWORKS.map((fw) => {
          const isSelected = selectedFrameworkId === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => setSelectedFrameworkId(fw.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{fw.shortName}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                fw.overallComplianceScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {fw.overallComplianceScore.toFixed(0)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Framework Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">{activeFramework.version}</span>
              <span className="text-[11px] text-slate-400">{activeFramework.regulatoryBody}</span>
            </div>
            <h2 className="text-base font-bold text-white mb-1">{activeFramework.name}</h2>
            <p className="text-xs text-slate-400">
              Evaluated across {activeFramework.totalControls} technical security controls and evidence streams.
            </p>
          </div>

          <div className="my-6 text-center">
            <div className="text-5xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {activeFramework.overallComplianceScore}%
            </div>
            <span className="text-xs text-slate-400 mt-1 block font-medium">Composite Audit Posture Score</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-4 border-t border-slate-800">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold font-mono block text-sm">{activeFramework.compliantCount}</span>
              <span className="text-[10px] text-slate-400">Compliant</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-amber-400 font-bold font-mono block text-sm">{activeFramework.partialCount}</span>
              <span className="text-[10px] text-slate-400">Partial</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-rose-400 font-bold font-mono block text-sm">{activeFramework.gapCount}</span>
              <span className="text-[10px] text-slate-400">Gaps</span>
            </div>
          </div>
        </div>

        {/* Domain Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Domain Compliance Scores</h3>
              <p className="text-xs text-slate-400 mt-0.5">Scored out of 100% across core categories</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091026', borderColor: '#1E293B', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any, _name: any, item: any) => [`${val}% Compliance (${item.payload.controls} controls)`, item.payload.fullName]}
                />
                <Bar dataKey="score" fill="#00E5FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Control Gap Analysis Table */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white">Control Gaps & Monetary Exposure Attribution</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed breakdown of controls with identified deficiencies and their direct financial impact
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Control Code & Title</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Evidence Verified</th>
                <th className="py-2.5 px-3 text-right">Financial Exposure Gap</th>
                <th className="py-2.5 px-3">Remediation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {activeFramework.controls.map((ctl) => (
                <tr key={ctl.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-cyan-400">{ctl.code}</div>
                    <div className="font-sans font-medium text-slate-200 mt-0.5">{ctl.title}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{ctl.domain}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      ctl.status === 'Compliant'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : ctl.status === 'Partial'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {ctl.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{ctl.evidenceCount} artifacts</td>
                  <td className="py-2.5 px-3 text-right">
                    {ctl.financialExposureGap > 0 ? (
                      <span className="font-bold text-rose-400">{formatRupees(ctl.financialExposureGap)}</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">₹0 (Secured)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 max-w-[260px] truncate">
                    {ctl.remediationAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Mapping Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Cross-Framework Harmonization Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating how one technical security implementation satisfies multiple overlapping regulatory frameworks.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Technical Initiative</th>
                <th className="py-2.5 px-3">RBI CSF Mandate</th>
                <th className="py-2.5 px-3">SEBI CSCRF Mandate</th>
                <th className="py-2.5 px-3">NIST CSF 2.0</th>
                <th className="py-2.5 px-3">ISO 27001:2022</th>
                <th className="py-2.5 px-3 text-right">Exposure at Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-[11px]">
              {crossMappingRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-white">{row.technicalControl}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[10px]">{row.rbi}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[10px]">{row.sebi}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[10px]">{row.nist}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[10px]">{row.iso}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400">
                    {formatRupees(row.exposure)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory Report Preview Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Regulatory Audit Report Preview</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <p>AUDIT ENTITY: Aarav FinServe Ltd</p>
                <p>TARGET FRAMEWORK: {activeFramework.name} ({activeFramework.version})</p>
                <p>REGULATORY OVERSIGHT: {activeFramework.regulatoryBody}</p>
                <p>AUDIT COMPLIANCE SCORE: {activeFramework.overallComplianceScore}%</p>
                <p>ATTRIBUTABLE UNMITIGATED EXPOSURE: {formatRupees(36800000)}</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 uppercase text-[11px] mb-1">
                  1. Statutory Findings & Deficiencies
                </h4>
                <p className="font-sans text-slate-200">
                  During automated telemetry verification, 2 critical control deficiencies were identified:
                  1) Privileged accounts in the Retail Banking and Core Payment subnets lack mandatory FIDO2 hardware MFA tokens;
                  2) The primary perimeter Fortinet SSL-VPN gateway carries unpatched CVE-2024-21762.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 uppercase text-[11px] mb-1">
                  2. Remediation Commitments & Timelines
                </h4>
                <p className="font-sans text-slate-200">
                  A board-approved capital remediation plan totaling ₹77 Lakh has been prioritized under CyberQuant AI's Knapsack Optimizer, scheduled for 100% completion within 6 weeks.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3 font-sans">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
              >
                Print Official Audit Certificate
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
