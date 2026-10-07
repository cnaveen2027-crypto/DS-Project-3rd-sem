import React, { useState, useEffect } from 'react';
import { ModelEvaluation, PredictionResult } from './types/ml';
import { INITIAL_MODELS, determineBestAlgorithm } from './data/modelsData';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { BestAlgorithmCard } from './components/BestAlgorithmCard';
import { AlgorithmComparisonTable } from './components/AlgorithmComparisonTable';
import { AccuracyBarChart } from './components/charts/AccuracyBarChart';
import { GroupedMetricsChart } from './components/charts/GroupedMetricsChart';
import { RocAucChart } from './components/charts/RocAucChart';
import { OverallMetricExplorer } from './components/charts/OverallMetricExplorer';
import { RankingHorizontalChart } from './components/charts/RankingHorizontalChart';
import { ConfusionMatrixCard } from './components/charts/ConfusionMatrixCard';
import { RocCurvesPlot } from './components/charts/RocCurvesPlot';
import { StrokeRiskPredictor } from './components/StrokeRiskPredictor';
import { MLWorkflowSection } from './components/MLWorkflowSection';
import { StrokeCareAssistant } from './components/StrokeCareAssistant';
import {
  BarChart3,
  Stethoscope,
  Grid,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function App() {
  const [models, setModels] = useState<ModelEvaluation[]>(INITIAL_MODELS);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'comparison' | 'graphs' | 'prediction' | 'confusion' | 'workflow'
  >('overview');
  const [selectedModelIdForPrediction, setSelectedModelIdForPrediction] = useState<string>('rf');
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Fetch evaluated models from backend on mount (with robust fallback to INITIAL_MODELS)
  useEffect(() => {
    fetch('/api/models')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (data.models && Array.isArray(data.models) && data.models.length > 0) {
          setModels(data.models);
        }
      })
      .catch((err) => {
        console.warn('Using client fallback models:', err);
      });
  }, []);

  // Compute best algorithm dynamically from evaluation results (never hard-coded!)
  const bestModel = determineBestAlgorithm(models);

  const handleUseModelForPrediction = (modelId: string) => {
    setSelectedModelIdForPrediction(modelId);
    setActiveTab('prediction');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssistant = () => {
    setIsAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAssistant={handleOpenAssistant}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* VIEW 1: DASHBOARD / HOME OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Landing Hero with 3 Main Buttons & 5 KPI cards */}
            <HeroLanding
              bestModel={bestModel}
              onNavigateToComparison={() => setActiveTab('comparison')}
              onNavigateToPrediction={() => setActiveTab('prediction')}
              onOpenAssistant={handleOpenAssistant}
            />

            {/* Best Algorithm Highlight Card (Section 4) */}
            <BestAlgorithmCard
              bestModel={bestModel}
              onNavigateToPrediction={() => handleUseModelForPrediction(bestModel.id)}
            />

            {/* Core Visual Comparison Section on Dashboard */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Key Visual Comparisons
                  </h3>
                  <p className="text-sm text-slate-500">
                    Visual comparison across 7 evaluated machine learning algorithms
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('graphs')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group self-start sm:self-auto"
                >
                  <span>Explore All 5 Interactive Graphs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccuracyBarChart models={models} bestModelId={bestModel.id} />
                <RankingHorizontalChart
                  models={models}
                  onSelectModelForPrediction={handleUseModelForPrediction}
                />
              </div>
            </div>

            {/* Teaser of the Comparison Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Algorithm Performance Matrix</h3>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Full Table View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <AlgorithmComparisonTable
                models={models}
                bestModelId={bestModel.id}
                onSelectModel={handleUseModelForPrediction}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: ALGORITHM COMPARISON PAGE (Main Feature!) */}
        {activeTab === 'comparison' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  Main Feature
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Machine Learning Algorithm Comparison
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Benchmark 7 diverse algorithms (Logistic Regression, Decision Tree, Random Forest, KNN, SVM, XGBoost, ANN) across Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('graphs')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Graphical Comparison</span>
                </button>
              </div>
            </div>

            {/* Best Algorithm Highlight Card (Section 4) */}
            <BestAlgorithmCard
              bestModel={bestModel}
              onNavigateToPrediction={() => handleUseModelForPrediction(bestModel.id)}
            />

            {/* Benchmark Table (Section 2) */}
            <AlgorithmComparisonTable
              models={models}
              bestModelId={bestModel.id}
              onSelectModel={handleUseModelForPrediction}
            />

            {/* Algorithm Selection Ranking Graph (Section 5) */}
            <RankingHorizontalChart
              models={models}
              onSelectModelForPrediction={handleUseModelForPrediction}
            />
          </div>
        )}

        {/* VIEW 3: GRAPHICAL COMPARISON (Most Important Part of Application!) */}
        {activeTab === 'graphs' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                Core Visual Analytics
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Interactive Graphical Algorithm Comparison
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Compare models visually using bar charts, grouped metrics, and ROC trajectory curves to clearly determine which algorithm is best for predicting stroke risk.
              </p>
            </div>

            {/* Graph 1: Accuracy Comparison */}
            <AccuracyBarChart models={models} bestModelId={bestModel.id} />

            {/* Graph 2: Grouped Bar Chart (Precision, Recall, F1-Score) */}
            <GroupedMetricsChart models={models} />

            {/* Graph 3: ROC-AUC Comparison */}
            <RocAucChart models={models} bestModelId={bestModel.id} />

            {/* Graph 4: Overall Model Performance Dynamic Explorer */}
            <OverallMetricExplorer models={models} />

            {/* Graph 5: Algorithm Selection Ranking Graph */}
            <RankingHorizontalChart
              models={models}
              onSelectModelForPrediction={handleUseModelForPrediction}
            />

            {/* Interactive ROC Curves (FPR vs TPR) */}
            <RocCurvesPlot models={models} bestModelId={bestModel.id} />
          </div>
        )}

        {/* VIEW 4: CONFUSION MATRIX & ROC CURVES */}
        {activeTab === 'confusion' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <ConfusionMatrixCard
              models={models}
              initialSelectedId={bestModel.id}
            />

            <RocCurvesPlot models={models} bestModelId={bestModel.id} />
          </div>
        )}

        {/* VIEW 5: STROKE RISK PREDICTION & RISK VISUALIZATION */}
        {activeTab === 'prediction' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <StrokeRiskPredictor
              models={models}
              bestModel={bestModel}
              activeModelId={selectedModelIdForPrediction}
              onPredictionChange={setCurrentPrediction}
            />
          </div>
        )}

        {/* VIEW 6: ML WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <MLWorkflowSection />
          </div>
        )}
      </main>

      {/* Gemini Chatbot: StrokeCare Assistant */}
      <StrokeCareAssistant
        models={models}
        bestModel={bestModel}
        currentPrediction={currentPrediction}
        isOpen={isAssistantOpen}
        onOpenChange={setIsAssistantOpen}
      />

      {/* Modern Healthcare Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">StrokeCare AI</span>
            <span>•</span>
            <span>AI-Powered Stroke Risk Prediction & Algorithm Analysis System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Machine Learning Research & Clinical Decision Support</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">7 Models Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
