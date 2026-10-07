import React from 'react';
import { ModelEvaluation } from '../types/ml';
import {
  BarChart3,
  Stethoscope,
  Bot,
  Trophy,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  bestModel: ModelEvaluation;
  onNavigateToComparison: () => void;
  onNavigateToPrediction: () => void;
  onOpenAssistant: () => void;
}

export const HeroLanding: React.FC<Props> = ({
  bestModel,
  onNavigateToComparison,
  onNavigateToPrediction,
  onOpenAssistant,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border border-blue-100 p-8 sm:p-12 text-center">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-bold tracking-wide shadow-xs border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Clinical Decision Support & Algorithm Benchmarking
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
              StrokeCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">AI</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-700">
              “AI-Powered Stroke Risk Prediction & Algorithm Analysis”
            </p>
          </div>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            StrokeCare AI compares multiple machine learning algorithms for stroke risk prediction, visualizes their performance, identifies the best-performing model, and uses the selected model for risk prediction.
          </p>

          {/* 3 Main Action Buttons from User Brief */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToComparison}
              className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Compare Algorithms</span>
            </button>

            <button
              onClick={onNavigateToPrediction}
              className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Predict Stroke Risk</span>
            </button>

            <button
              onClick={onOpenAssistant}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
              <span>Gemini Chatbot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 10: Main Dashboard KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: 7 Models Tested */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span className="uppercase tracking-wider">Model Comparison</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            7 Models
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Tested & Benchmarked
          </span>
        </div>

        {/* Card 2: Best Model */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
            <span className="uppercase tracking-wider">Best Model</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-950 truncate" title={bestModel.name}>
            {bestModel.shortName}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            Highest Composite Score
          </span>
        </div>

        {/* Card 3: Best Accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span className="uppercase tracking-wider">Best Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {bestModel.accuracy.toFixed(2)}%
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {bestModel.shortName}
          </span>
        </div>

        {/* Card 4: Best F1-Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span className="uppercase tracking-wider">Best F1-Score</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {bestModel.f1Score.toFixed(2)}%
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Balanced Sensitivity
          </span>
        </div>

        {/* Card 5: Best ROC-AUC */}
        <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span className="uppercase tracking-wider">Best ROC-AUC</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {bestModel.rocAuc.toFixed(2)}%
          </div>
          <span className="text-[11px] text-purple-600 font-semibold block mt-1">
            AUC: {(bestModel.rocAuc / 100).toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};
