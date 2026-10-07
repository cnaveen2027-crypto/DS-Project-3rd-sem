import React, { useState } from 'react';
import { ModelEvaluation } from '../../types/ml';
import { TrendingUp, Check } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  bestModelId: string;
}

const COLOR_MAP: Record<string, string> = {
  rf: '#059669', // Emerald
  xgb: '#2563eb', // Blue
  ann: '#9333ea', // Purple
  svm: '#0891b2', // Cyan
  dt: '#d97706', // Amber
  knn: '#e11d48', // Rose
  lr: '#475569', // Slate
};

export const RocCurvesPlot: React.FC<Props> = ({ models, bestModelId }) => {
  const [selectedModels, setSelectedModels] = useState<string[]>(models.map((m) => m.id));
  const [hoveredPoint, setHoveredPoint] = useState<{
    model: string;
    fpr: number;
    tpr: number;
  } | null>(null);

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter((m) => m !== id));
      }
    } else {
      setSelectedModels([...selectedModels, id]);
    }
  };

  const selectAll = () => setSelectedModels(models.map((m) => m.id));
  const selectTopTwo = () => setSelectedModels(['rf', 'xgb']);

  // Convert (fpr, tpr) coordinates to SVG path (width 400, height 300)
  // Origin (0,0) is bottom-left -> in SVG x = fpr * 360 + 35, y = 265 - tpr * 230
  const getSvgPath = (points: Array<{ fpr: number; tpr: number }>) => {
    return points
      .map((p, i) => {
        const x = 35 + p.fpr * 330;
        const y = 265 - p.tpr * 230;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Interactive Curve
            </span>
            <h3 className="text-lg font-bold text-slate-900">Multi-Model ROC Curves (FPR vs TPR)</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Visual trade-off between True Positive Rate (Sensitivity) and False Positive Rate (1 - Specificity)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={selectAll}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          >
            All 7 Models
          </button>
          <button
            onClick={selectTopTwo}
            className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium"
          >
            Top 2 Contenders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Plot Graphic */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-[4/3] bg-slate-900 rounded-2xl p-4 shadow-inner border border-slate-800">
            {/* Tooltip */}
            {hoveredPoint && (
              <div className="absolute top-4 right-4 bg-slate-800/90 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none">
                <span className="font-semibold text-emerald-400">{hoveredPoint.model}</span>
                <div className="text-[11px] text-slate-300 font-mono">
                  TPR: {(hoveredPoint.tpr * 100).toFixed(1)}% | FPR: {(hoveredPoint.fpr * 100).toFixed(1)}%
                </div>
              </div>
            )}

            <svg viewBox="0 0 400 300" className="w-full h-full select-none">
              {/* Background grid */}
              <line x1="35" y1="35" x2="365" y2="35" stroke="#334155" strokeDasharray="3 3" />
              <line x1="35" y1="92" x2="365" y2="92" stroke="#334155" strokeDasharray="3 3" />
              <line x1="35" y1="150" x2="365" y2="150" stroke="#334155" strokeDasharray="3 3" />
              <line x1="35" y1="207" x2="365" y2="207" stroke="#334155" strokeDasharray="3 3" />
              <line x1="35" y1="265" x2="365" y2="265" stroke="#475569" strokeWidth="1.5" />

              <line x1="35" y1="35" x2="35" y2="265" stroke="#475569" strokeWidth="1.5" />
              <line x1="117" y1="35" x2="117" y2="265" stroke="#334155" strokeDasharray="3 3" />
              <line x1="200" y1="35" x2="200" y2="265" stroke="#334155" strokeDasharray="3 3" />
              <line x1="282" y1="35" x2="282" y2="265" stroke="#334155" strokeDasharray="3 3" />
              <line x1="365" y1="35" x2="365" y2="265" stroke="#334155" strokeDasharray="3 3" />

              {/* Diagonal Random Guess Baseline (AUC 0.50) */}
              <line
                x1="35"
                y1="265"
                x2="365"
                y2="35"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="210" y="160" fill="#94a3b8" fontSize="10" transform="rotate(-32 210 160)">
                Random Classifier (AUC 0.50)
              </text>

              {/* Model ROC Paths */}
              {models.map((model) => {
                if (!selectedModels.includes(model.id)) return null;
                const pathStr = getSvgPath(model.rocCurve);
                const color = COLOR_MAP[model.id] || '#3b82f6';
                const isBest = model.id === bestModelId;

                return (
                  <g key={model.id}>
                    <path
                      d={pathStr}
                      fill="none"
                      stroke={color}
                      strokeWidth={isBest ? 3.5 : 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300 hover:stroke-white cursor-pointer"
                      opacity={isBest ? 1 : 0.85}
                    />
                    {/* Points on curve */}
                    {model.rocCurve.map((p, idx) => {
                      const cx = 35 + p.fpr * 330;
                      const cy = 265 - p.tpr * 230;
                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={isBest ? 3.5 : 2.5}
                          fill={color}
                          stroke="#0f172a"
                          strokeWidth="1"
                          className="hover:r-5 cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredPoint({ model: model.name, fpr: p.fpr, tpr: p.tpr })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Axis Labels */}
              <text x="10" y="40" fill="#94a3b8" fontSize="10">1.0</text>
              <text x="10" y="95" fill="#94a3b8" fontSize="10">0.75</text>
              <text x="10" y="153" fill="#94a3b8" fontSize="10">0.50</text>
              <text x="10" y="210" fill="#94a3b8" fontSize="10">0.25</text>
              <text x="10" y="268" fill="#94a3b8" fontSize="10">0.0</text>

              <text x="30" y="285" fill="#94a3b8" fontSize="10">0.0</text>
              <text x="110" y="285" fill="#94a3b8" fontSize="10">0.25</text>
              <text x="195" y="285" fill="#94a3b8" fontSize="10">0.50</text>
              <text x="277" y="285" fill="#94a3b8" fontSize="10">0.75</text>
              <text x="355" y="285" fill="#94a3b8" fontSize="10">1.0</text>

              <text x="160" y="298" fill="#cbd5e1" fontSize="11" fontWeight="bold">
                False Positive Rate (FPR)
              </text>
              <text
                x="-180"
                y="14"
                fill="#cbd5e1"
                fontSize="11"
                fontWeight="bold"
                transform="rotate(-90)"
              >
                True Positive Rate (TPR / Recall)
              </text>
            </svg>
          </div>
        </div>

        {/* Legend & Toggles */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Models & AUC Scores (Click to toggle)
          </div>
          <div className="space-y-1.5">
            {models.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              const color = COLOR_MAP[model.id] || '#3b82f6';
              const isBest = model.id === bestModelId;

              return (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? isBest
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-white border-dashed border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span>{model.shortName}</span>
                    {isBest && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-extrabold uppercase">
                        Best
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold">
                    {(model.rocAuc / 100).toFixed(3)} AUC
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Curves closer to top-left corner reflect superior clinical sensitivity with minimal false alarms.
          </p>
        </div>
      </div>
    </div>
  );
};
