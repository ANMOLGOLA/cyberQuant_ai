import { useState, useMemo } from 'react';
import { generateFullAssetCatalog } from './data/mockData';
import { quantifyEnterpriseRisk, CalculatedAsset } from './lib/riskEngine';
import { solveSecurityInvestmentKnapsack } from './lib/optimizer';
import { CANDIDATE_PROJECTS } from './data/mockData';
import { TopBar } from './components/layout/TopBar';
import { LandingPage } from './pages/LandingPage';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { RiskEnginePage } from './pages/RiskEnginePage';
import { DecisionSupportPage } from './pages/DecisionSupportPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { CompliancePage } from './pages/CompliancePage';
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { BoardReportModal } from './components/modals/BoardReportModal';
import { DemoTour } from './components/walkthrough/DemoTour';
import { OptimizationResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isThreatSimulated, setIsThreatSimulated] = useState<boolean>(false);

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<CalculatedAsset | null>(null);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isBoardReportOpen, setIsBoardReportOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  // Raw assets catalog (stable seeded)
  const rawAssets = useMemo(() => generateFullAssetCatalog(), []);

  // Threat multiplier for continuous drift demonstration
  const activeThreatMultiplier = isThreatSimulated ? 1.48 : 1.0;

  // Real-time enterprise quantification
  const { calculatedAssets, metrics } = useMemo(() => {
    return quantifyEnterpriseRisk(rawAssets, undefined, activeThreatMultiplier);
  }, [rawAssets, activeThreatMultiplier]);

  // Default knapsack result for board report modal
  const defaultOptimizationResult: OptimizationResult = useMemo(() => {
    return solveSecurityInvestmentKnapsack(CANDIDATE_PROJECTS, 10000000, metrics.totalEal);
  }, [metrics.totalEal]);

  const [currentOptimizationResult, setCurrentOptimizationResult] = useState<OptimizationResult>(defaultOptimizationResult);

  const handleOpenBoardReport = (result?: OptimizationResult) => {
    if (result) setCurrentOptimizationResult(result);
    setIsBoardReportOpen(true);
  };

  const handleSimulateThreat = () => {
    setIsThreatSimulated((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSimulateThreat={handleSimulateThreat}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        isThreatSimulated={isThreatSimulated}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchDemo={() => setActiveTab('dashboard')}
            metrics={metrics}
          />
        )}

        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            metrics={metrics}
            assets={calculatedAssets}
            onSelectAsset={setSelectedAsset}
            onSimulateThreat={handleSimulateThreat}
            isThreatSimulated={isThreatSimulated}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'engine' && (
          <RiskEnginePage
            metrics={metrics}
            assets={calculatedAssets}
            onSelectAsset={setSelectedAsset}
          />
        )}

        {activeTab === 'decision' && (
          <DecisionSupportPage
            metrics={metrics}
            assets={calculatedAssets}
            rawAssets={rawAssets}
            onSelectAsset={setSelectedAsset}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'optimization' && (
          <OptimizationPage
            metrics={metrics}
            onOpenBoardReport={handleOpenBoardReport}
          />
        )}

        {activeTab === 'compliance' && (
          <CompliancePage />
        )}
      </main>

      {/* Modals & Overlays */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <BoardReportModal
        isOpen={isBoardReportOpen}
        onClose={() => setIsBoardReportOpen(false)}
        metrics={metrics}
        optimizationResult={currentOptimizationResult}
      />

      <DemoTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
