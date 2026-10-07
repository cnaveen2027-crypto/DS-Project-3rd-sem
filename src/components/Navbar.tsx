import React from 'react';
import { Activity, BarChart2, Stethoscope, Bot, Layers, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  activeTab: 'overview' | 'comparison' | 'graphs' | 'prediction' | 'confusion' | 'workflow';
  setActiveTab: (tab: 'overview' | 'comparison' | 'graphs' | 'prediction' | 'confusion' | 'workflow') => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenAssistant }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Main Title */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  StrokeCare <span className="text-blue-600">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                  ML Benchmarking
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                AI-Powered Stroke Risk Prediction & Algorithm Analysis
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Compare Algorithms
            </button>
            <button
              onClick={() => setActiveTab('graphs')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'graphs'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Visual Graphs
            </button>
            <button
              onClick={() => setActiveTab('confusion')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'confusion'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Confusion Matrix & ROC
            </button>
            <button
              onClick={() => setActiveTab('prediction')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'prediction'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Predict Stroke Risk
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'workflow'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              ML Workflow
            </button>
          </nav>

          {/* Quick Gemini Chatbot Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAssistant}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
              <span>Gemini Chatbot</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 border-t border-slate-100 gap-1.5 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
              activeTab === 'overview' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
              activeTab === 'comparison' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Compare Models
          </button>
          <button
            onClick={() => setActiveTab('graphs')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
              activeTab === 'graphs' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Visual Graphs
          </button>
          <button
            onClick={() => setActiveTab('confusion')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
              activeTab === 'confusion' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Confusion Matrix
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
              activeTab === 'prediction' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Predict Risk
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
              activeTab === 'workflow' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Workflow
          </button>
          <button
            onClick={onOpenAssistant}
            className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-teal-300" />
            <span>Gemini Chatbot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
