import React, { useState } from 'react';
import { ModelEvaluation, MetricKey } from '../../types/ml';
import { Sliders, Sparkles, BarChart3 } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
}

const METRIC_CONFIGS: Record<
  MetricKey,
  {
    label: string;
    description: string;
    gradient: string;
    badgeColor: string;
    formula: string;
    clinicalRelevance: string;
  }
> = {
  accuracy: {
    label: 'Accuracy',
    description: 'Overall proportion of correct classifications over all patients tested.',
    gradient: 'from-blue-600 to-cyan-400',
    badgeColor: 'bg-blue-100 text-blue-800',
    formula: '(TP + TN) / (TP + TN + FP + FN)',
    clinicalRelevance: 'Good baseline metric, but should not be evaluated alone due to healthy vs stroke class imbalance.',
  },
  precision: {
    label: 'Precision (Positive Predictive Value)',
    description: 'Proportion of patients predicted as high risk who actually had or will experience a stroke.',
    gradient: 'from-indigo-600 to-purple-400',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    formula: 'TP / (TP + FP)',
    clinicalRelevance: 'Avoids diagnostic false alarms and unnecessary invasive tests or anxiety for patients.',
  },
  recall: {
    label: 'Recall (Sensitivity / True Positive Rate)',
    description: 'Proportion of actual stroke patients correctly identified by the algorithm.',
    gradient: 'from-teal-600 to-emerald-400',
    badgeColor: 'bg-teal-100 text-teal-800',
    formula: 'TP / (TP + FN)',
    clinicalRelevance: 'Most crucial metric in acute emergency triage to prevent missed stroke events.',
  },
  f1Score: {
    label: 'F1-Score',
    description: 'Harmonic mean of precision and recall; balanced metric for imbalanced biomedical data.',
    gradient: 'from-amber-600 to-orange-400',
    badgeColor: 'bg-amber-100 text-amber-800',
    formula: '2 × (Precision × Recall) / (Precision + Recall)',
    clinicalRelevance: 'Provides single representative score balancing detection sensitivity with specificity.',
  },
  rocAuc: {
    label: 'ROC-AUC',
    description: 'Area Under Receiver Operating Characteristic Curve across all decision thresholds.',
    gradient: 'from-fuchsia-600 to-pink-400',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800',
    formula: '∫ TPR(FPR) d(FPR)',
    clinicalRelevance: 'Quantifies the overall diagnostic power of the classifier across any risk probability threshold.',
  },
};

export const OverallMetricExplorer: React.FC<Props> = ({ models }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('accuracy');
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const currentConfig = METRIC_CONFIGS[selectedMetric];

  // Sort models by selected metric descending to give clear comparative insight
  const sortedModels = [...models].sort((a, b) => b[selectedMetric] - a[selectedMetric]);
  const bestForSelected = sortedModels[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">
              Graph 4
            </span>
            <h3 className="text-lg font-bold text-slate-900">Overall Model Performance</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic metric explorer — switch metrics to compare algorithm trade-offs
          </p>
        </div>

        {/* Dynamic Metric Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="metric-select" className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Select Metric:
          </label>
          <div className="relative">
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
              aria-label="Select Machine Learning Metric"
              className="bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl px-4 py-2 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer shadow-xs hover:bg-slate-100 transition-colors"
            >
              <option value="accuracy">Accuracy (%)</option>
              <option value="precision">Precision (%)</option>
              <option value="recall">Recall (Sensitivity) (%)</option>
              <option value="f1Score">F1-Score (%)</option>
              <option value="rocAuc">ROC-AUC (%)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Context Banner */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-bold ${currentConfig.badgeColor}`}>
              {currentConfig.label}
            </span>
            <span className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Formula: {currentConfig.formula}
            </span>
          </div>
          <p className="text-slate-600 mt-1">{currentConfig.clinicalRelevance}</p>
        </div>
        <div className="shrink-0 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>
            Top for {currentConfig.label}:{' '}
            <strong className="text-slate-900">{bestForSelected.shortName}</strong> ({bestForSelected[selectedMetric].toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Dynamic Graph Area */}
      <div className="h-72 w-full pt-2 flex flex-col justify-end">
        <div className="relative w-full h-56 flex items-end gap-3 sm:gap-6 border-b border-slate-200 px-2 sm:px-6">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 -left-1">
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>100%</span>
            </div>
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>90%</span>
            </div>
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>80%</span>
            </div>
            <div className="border-b border-slate-200 flex items-center justify-between">
              <span>70%</span>
            </div>
          </div>

          {/* Dynamic Bars (Rendered in sorted order for instant visual clarity) */}
          {sortedModels.map((model, index) => {
            const val = model[selectedMetric];
            const isWinner = index === 0;
            const isHovered = hoveredModel === model.id;
            const heightPercent = Math.max(8, ((val - 70) / 30) * 100);

            return (
              <div
                key={model.id}
                className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-10"
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-30 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-xl whitespace-nowrap pointer-events-none">
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-sky-300 font-mono">
                      {currentConfig.label}: <span className="font-bold text-white">{val.toFixed(2)}%</span>
                    </p>
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                )}

                <div
                  className={`text-[11px] font-bold mb-1.5 transition-transform ${
                    isWinner ? 'text-blue-700 bg-blue-50 px-1 rounded font-extrabold' : 'text-slate-700'
                  }`}
                >
                  {val.toFixed(1)}%
                </div>

                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-500 relative ${
                    isWinner
                      ? `bg-gradient-to-t ${currentConfig.gradient} shadow-lg ring-2 ring-blue-400/40`
                      : 'bg-gradient-to-t from-slate-600 to-slate-400 hover:from-slate-700 hover:to-slate-300'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {isWinner && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-1 py-0.2 rounded-full shadow-xs">
                      #1
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="w-full flex gap-3 sm:gap-6 px-2 sm:px-6 mt-3">
          {sortedModels.map((model, idx) => (
            <div key={model.id} className="flex-1 text-center">
              <span
                className={`block text-[11px] sm:text-xs font-medium truncate ${
                  idx === 0 ? 'text-blue-900 font-bold' : 'text-slate-600'
                }`}
                title={model.name}
              >
                {model.shortName}
              </span>
              <span className="text-[10px] text-slate-400">Rank #{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
