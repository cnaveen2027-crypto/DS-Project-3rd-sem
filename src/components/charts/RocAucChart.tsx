import React, { useState } from 'react';
import { ModelEvaluation } from '../../types/ml';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  bestModelId: string;
}

export const RocAucChart: React.FC<Props> = ({ models, bestModelId }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ROC-AUC baseline (0.5 is random chance, 0.7 acceptable, 0.8 good, 0.9 excellent)
  const baseline = 70;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800">
              Graph 3
            </span>
            <h3 className="text-lg font-bold text-slate-900">ROC-AUC Comparison</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Area Under Receiver Operating Characteristic Curve — Measures classification discrimination capability
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-violet-50 text-violet-700 font-semibold border border-violet-200">
            &gt; 90% = Outstanding Clinical Discriminator
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-4 flex flex-col justify-end">
        <div className="relative w-full h-56 flex items-end gap-3 sm:gap-6 border-b border-slate-200 px-2 sm:px-6">
          {/* Reference Line for 90% Threshold */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-violet-400 z-0 pointer-events-none"
            style={{ bottom: `${((90 - baseline) / (100 - baseline)) * 100}%` }}
          >
            <span className="absolute -top-2.5 right-2 text-[10px] font-bold text-violet-700 bg-white px-1.5 rounded shadow-xs">
              90% Excellent Cutoff
            </span>
          </div>

          {/* Grid lines */}
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
            const heightPercent = Math.max(8, ((model.rocAuc - baseline) / (100 - baseline)) * 100);

            return (
              <div
                key={model.id}
                className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-10"
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-30 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-xl whitespace-nowrap pointer-events-none">
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-violet-300">
                      ROC-AUC: <span className="font-bold text-white">{model.rocAuc.toFixed(2)}%</span>
                      {isBest ? ' (Highest Discriminating Power)' : ''}
                    </p>
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                )}

                <div
                  className={`text-[11px] font-bold mb-1.5 transition-transform ${
                    isBest
                      ? 'text-violet-800 bg-violet-100 px-1.5 py-0.5 rounded border border-violet-300'
                      : 'text-slate-700'
                  }`}
                >
                  {model.rocAuc.toFixed(1)}%
                </div>

                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-500 relative ${
                    isBest
                      ? 'bg-gradient-to-t from-violet-700 to-fuchsia-500 shadow-md shadow-violet-200 ring-2 ring-violet-400/50'
                      : 'bg-gradient-to-t from-purple-700 to-indigo-400 hover:from-purple-800 hover:to-indigo-300'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {isBest && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-violet-600 bg-white rounded-full p-0.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="w-full flex gap-3 sm:gap-6 px-2 sm:px-6 mt-3">
          {models.map((model) => (
            <div key={model.id} className="flex-1 text-center">
              <span
                className={`block text-[11px] sm:text-xs font-medium truncate ${
                  model.id === bestModelId ? 'text-violet-900 font-bold' : 'text-slate-600'
                }`}
                title={model.name}
              >
                {model.shortName}
              </span>
              <span className="text-[10px] text-slate-400">
                AUC: {(model.rocAuc / 100).toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
          <span>
            ROC-AUC evaluates how well the algorithm separates patients who will develop stroke from those who won't, regardless of classification threshold.
          </span>
        </div>
      </div>
    </div>
  );
};
