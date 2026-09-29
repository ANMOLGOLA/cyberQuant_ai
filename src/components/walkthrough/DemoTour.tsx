import { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, X, CheckCircle2 } from 'lucide-react';

interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Welcome to ArthaRisk',
    targetTab: 'landing',
    content: 'Enterprises describe risk as "Low/Medium/High", leaving boards unable to make financial decisions. ArthaRisk continuously translates technical telemetry into MONETARY exposure (Expected Annual Loss & VaR) in Indian Rupees (₹).',
    actionText: 'Go to Executive Dashboard',
  },
  {
    step: 2,
    title: 'Executive CISO / Board Dashboard',
    targetTab: 'dashboard',
    content: 'View real-time financial exposure (₹4.82 Cr EAL), 95% Value at Risk, loss-category distribution (Downtime vs Breach vs Penalties), and test the "Simulate Threat Event" button to watch numbers recalculate live.',
    actionText: 'Examine Technical Engine',
  },
  {
    step: 3,
    title: 'Technical Risk Engine & Math Proof',
    targetTab: 'engine',
    content: 'Explore 45+ monitored assets across 5 business units. Click any asset to inspect its dependency graph, vulnerabilities with EPSS exploit probabilities, and the expandable step-by-step formula proof with live numbers plugged in.',
    actionText: 'Test AI Decision Lab',
  },
  {
    step: 4,
    title: 'AI Decision Support & Natural Language Copilot',
    targetTab: 'decision',
    content: 'Query our AI Copilot with prompts like "What is our highest financial risk today?" or "What if we implement MFA on all privileged accounts?". Answers are synthesized with inline metrics and tables using Gemini API / local semantic parser.',
    actionText: 'Explore What-If Lab',
  },
  {
    step: 5,
    title: 'Scenario Simulator ("What-If" Lab)',
    targetTab: 'decision',
    content: 'Adjust sliders for MFA adoption, Critical Patch SLAs, Network Segmentation, and Remediation Delay. Watch real-time before vs. after deltas and waterfall charts calculate how each decision shifts financial risk.',
    actionText: 'Run Capital Optimizer',
  },
  {
    step: 6,
    title: '0/1 Knapsack Investment Optimizer',
    targetTab: 'optimization',
    content: 'Set an annual budget (e.g. ₹1.00 Cr). Our 0/1 knapsack algorithm selects the exact combination of security controls maximizing risk reduction, plots the diminishing returns curve with the optimal spend knee point, and exports a print-ready Board Report.',
    actionText: 'Finish Tour',
  },
];

export function DemoTour({ isOpen, onClose, onNavigateTab }: DemoTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNavigateTab(TOUR_STEPS[nextIndex].targetTab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onNavigateTab(TOUR_STEPS[prevIndex].targetTab);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-[#081026] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 text-slate-100 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              Smart India Hackathon Walkthrough
            </span>
            <div className="text-xs text-slate-400">
              Step {currentStep.step} of {TOUR_STEPS.length}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="my-3">
        <h3 className="text-sm font-bold text-slate-100 mb-1">{currentStep.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{currentStep.content}</p>
      </div>

      {/* Progress indicators */}
      <div className="flex items-center gap-1.5 mb-4">
        {TOUR_STEPS.map((s, idx) => (
          <div
            key={s.step}
            className={`h-1 rounded-full transition-all ${
              idx === currentStepIndex
                ? 'w-6 bg-cyan-400'
                : idx < currentStepIndex
                ? 'w-2 bg-emerald-400'
                : 'w-2 bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 font-medium transition-colors ${
            currentStepIndex === 0
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
        >
          <span>{currentStep.actionText}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
