import React, { useState } from 'react';
import { ModelEvaluation } from '../../types/ml';
import { Award, Info } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  bestModelId: string;
}

export const AccuracyBarChart: React.FC<Props> = ({ models, bestModelId }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Find max and min for scaling
  const maxAcc = Math.max(...models.map((m) => m.accuracy));
  const minAcc = 70; // baseline so differences are easily discernible

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Graph 1
            </span>
            <h3 className="text-lg font-bold text-slate-900">Accuracy Comparison</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Percentage of total correct predictions (True Positives + True Negatives) / Total Patients
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <span className="inline-block w-3 h-3 rounded bg-blue-600"></span> Standard
          <span className="inline-block w-3 h-3 rounded bg-emerald-500 ml-2"></span> Top Performer
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full pt-4 flex flex-col justify-end">
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

          {/* Bars */}
          {models.map((model) => {
            const isBest = model.id === bestModelId;
            const isHovered = hoveredId === model.id;
            // Height calculation normalized between 70% and 100%
            const heightPercent = Math.max(8, ((model.accuracy - minAcc) / (100 - minAcc)) * 100);

            return (
              <div
                key={model.id}
                className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-10"
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-30 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-xl whitespace-nowrap pointer-events-none transition-all transform -translate-y-1">
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-blue-300">
                      Accuracy: <span className="font-bold text-white">{model.accuracy.toFixed(2)}%</span>
                      {isBest && ' (Highest)'}
                    </p>
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                )}

                {/* Score value pill above bar */}
                <div
                  className={`text-[11px] font-bold mb-1.5 transition-transform ${
                    isBest
                      ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shadow-xs'
                      : 'text-slate-700'
                  }`}
                >
                  {model.accuracy.toFixed(1)}%
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-500 relative ${
                    isBest
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-500 shadow-md shadow-emerald-200 ring-2 ring-emerald-400/50'
                      : 'bg-gradient-to-t from-blue-700 to-sky-500 hover:from-blue-800 hover:to-sky-400'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {isBest && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-500 bg-white rounded-full p-0.5 shadow-sm">
                      <Award className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis Labels */}
        <div className="w-full flex gap-3 sm:gap-6 px-2 sm:px-6 mt-3">
          {models.map((model) => {
            const isBest = model.id === bestModelId;
            return (
              <div key={model.id} className="flex-1 text-center">
                <span
                  className={`block text-[11px] sm:text-xs font-medium truncate ${
                    isBest ? 'text-emerald-700 font-bold' : 'text-slate-600'
                  }`}
                  title={model.name}
                >
                  {model.shortName}
                </span>
                {isBest && (
                  <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-50 px-1 rounded">
                    Rank 1
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>
            Highest Accuracy: <strong>{models.find((m) => m.id === bestModelId)?.shortName}</strong> ({maxAcc.toFixed(2)}%)
          </span>
        </div>
        <span className="text-slate-400">N = 1,022 test samples</span>
      </div>
    </div>
  );
};
