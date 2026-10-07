import React, { useState } from 'react';
import { ModelEvaluation } from '../../types/ml';
import { Target, AlertTriangle } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
}

export const GroupedMetricsChart: React.FC<Props> = ({ models }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'precision' | 'recall' | 'f1Score'>('all');
  const [tooltipData, setTooltipData] = useState<{
    model: string;
    metric: string;
    value: number;
    desc: string;
  } | null>(null);

  const baseline = 65; // Baseline scale starting point to amplify visual discrimination

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              Graph 2
            </span>
            <h3 className="text-lg font-bold text-slate-900">Precision, Recall & F1-Score</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grouped performance metrics showing clinical sensitivity trade-offs and balanced harmony
          </p>
        </div>

        {/* Legend / Filter toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveMetric('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setActiveMetric('precision')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'precision'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span> Precision
          </button>
          <button
            onClick={() => setActiveMetric('recall')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'recall'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded bg-teal-500"></span> Recall (Sensitivity)
          </button>
          <button
            onClick={() => setActiveMetric('f1Score')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'f1Score'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> F1-Score
          </button>
        </div>
      </div>

      {/* Grouped Bar Chart Area */}
      <div className="h-80 w-full pt-4 flex flex-col justify-end relative">
        {/* Floating Tooltip */}
        {tooltipData && (
          <div className="absolute top-2 right-4 z-30 bg-slate-900/95 backdrop-blur text-white text-xs rounded-lg py-2 px-3 shadow-xl pointer-events-none border border-slate-700 animate-in fade-in">
            <p className="font-semibold text-slate-200">{tooltipData.model}</p>
            <p className="text-white font-bold text-sm">
              {tooltipData.metric}: <span className="text-sky-300">{tooltipData.value.toFixed(2)}%</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{tooltipData.desc}</p>
          </div>
        )}

        <div className="relative w-full h-64 flex items-end gap-3 sm:gap-6 border-b border-slate-200 px-2 sm:px-4">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>100%</span>
            </div>
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>90%</span>
            </div>
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>80%</span>
            </div>
            <div className="border-b border-dashed border-slate-100 flex items-center justify-between">
              <span>70%</span>
            </div>
            <div className="border-b border-slate-200 flex items-center justify-between">
              <span>65%</span>
            </div>
          </div>

          {/* Groups per Model */}
          {models.map((model) => {
            const precHeight = Math.max(5, ((model.precision - baseline) / (100 - baseline)) * 100);
            const recHeight = Math.max(5, ((model.recall - baseline) / (100 - baseline)) * 100);
            const f1Height = Math.max(5, ((model.f1Score - baseline) / (100 - baseline)) * 100);

            return (
              <div
                key={model.id}
                className="relative flex-1 flex flex-col items-center h-full justify-end z-10"
              >
                {/* 3 Grouped Bars Side-by-Side */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                  {/* Precision Bar */}
                  {(activeMetric === 'all' || activeMetric === 'precision') && (
                    <div
                      className="flex-1 max-w-[16px] sm:max-w-[20px] bg-gradient-to-t from-indigo-700 to-indigo-400 rounded-t-sm sm:rounded-t transition-all duration-300 hover:brightness-110 cursor-pointer shadow-xs"
                      style={{ height: `${precHeight}%` }}
                      onMouseEnter={() =>
                        setTooltipData({
                          model: model.name,
                          metric: 'Precision',
                          value: model.precision,
                          desc: 'True Positives / (True Positives + False Positives)',
                        })
                      }
                      onMouseLeave={() => setTooltipData(null)}
                    />
                  )}

                  {/* Recall Bar */}
                  {(activeMetric === 'all' || activeMetric === 'recall') && (
                    <div
                      className="flex-1 max-w-[16px] sm:max-w-[20px] bg-gradient-to-t from-teal-700 to-teal-400 rounded-t-sm sm:rounded-t transition-all duration-300 hover:brightness-110 cursor-pointer shadow-xs"
                      style={{ height: `${recHeight}%` }}
                      onMouseEnter={() =>
                        setTooltipData({
                          model: model.name,
                          metric: 'Recall (Sensitivity)',
                          value: model.recall,
                          desc: 'True Positives / (True Positives + False Negatives) - Minimizes missed stroke cases!',
                        })
                      }
                      onMouseLeave={() => setTooltipData(null)}
                    />
                  )}

                  {/* F1-Score Bar */}
                  {(activeMetric === 'all' || activeMetric === 'f1Score') && (
                    <div
                      className="flex-1 max-w-[16px] sm:max-w-[20px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm sm:rounded-t transition-all duration-300 hover:brightness-110 cursor-pointer shadow-xs"
                      style={{ height: `${f1Height}%` }}
                      onMouseEnter={() =>
                        setTooltipData({
                          model: model.name,
                          metric: 'F1-Score',
                          value: model.f1Score,
                          desc: 'Harmonic mean of Precision and Recall',
                        })
                      }
                      onMouseLeave={() => setTooltipData(null)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis Labels */}
        <div className="w-full flex gap-3 sm:gap-6 px-2 sm:px-4 mt-3">
          {models.map((model) => (
            <div key={model.id} className="flex-1 text-center">
              <span className="block text-[10px] sm:text-xs font-medium text-slate-700 truncate" title={model.name}>
                {model.shortName}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                F1: {model.f1Score.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical insight box */}
      <div className="mt-5 p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
        <Target className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-indigo-900">Why Recall & F1-Score Matter Clinically:</span> In acute stroke risk triage, <strong>Recall</strong> (True Positive Rate) is paramount. Missing a stroke patient (False Negative) can result in irreversible disability or fatality, whereas a False Positive only triggers precautionary preventive lifestyle screening.
        </div>
      </div>
    </div>
  );
};
