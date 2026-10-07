import React, { useState } from 'react';
import { ModelEvaluation } from '../../types/ml';
import { Grid, AlertCircle, CheckCircle, HelpCircle, Activity } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  initialSelectedId?: string;
}

export const ConfusionMatrixCard: React.FC<Props> = ({ models, initialSelectedId }) => {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(initialSelectedId || models[0].id);

  const currentModel = models.find((m) => m.id === selectedAlgoId) || models[0];
  const { tp, tn, fp, fn, total } = currentModel.confusionMatrix;

  // Derived clinical calculations
  const sensitivity = (tp / (tp + fn)) * 100; // Recall
  const specificity = (tn / (tn + fp)) * 100;
  const precisionVal = (tp / (tp + fp)) * 100;
  const npv = (tn / (tn + fn)) * 100; // Negative Predictive Value
  const accuracyCalc = ((tp + tn) / total) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      {/* Header and Algorithm Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              Section 8
            </span>
            <h3 className="text-lg font-bold text-slate-900">Confusion Matrix Visualization</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Diagnostic breakdown of True Positives, True Negatives, False Positives, and False Negatives
          </p>
        </div>

        {/* Algorithm Selector Dropdown */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="cm-algo-select" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Select Algorithm:
          </label>
          <div className="relative">
            <select
              id="cm-algo-select"
              value={selectedAlgoId}
              onChange={(e) => setSelectedAlgoId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl px-4 py-2 pr-9 focus:ring-2 focus:ring-rose-500 focus:outline-none appearance-none cursor-pointer shadow-xs hover:bg-slate-100 transition-colors"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Matrix on Left, Diagnostic Metrics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 2x2 Matrix Grid */}
        <div className="lg:col-span-7">
          <div className="max-w-md mx-auto">
            {/* Top Column Labels (Predicted) */}
            <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Predicted Condition
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold text-slate-700 mb-1 ml-16 sm:ml-20">
              <div className="bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                Predicted Negative (No Stroke)
              </div>
              <div className="bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                Predicted Positive (Stroke)
              </div>
            </div>

            {/* Matrix with Row Labels */}
            <div className="flex">
              {/* Actual Condition Row Labels */}
              <div className="w-16 sm:w-20 flex flex-col justify-around text-center text-[11px] sm:text-xs font-semibold text-slate-700 pr-2">
                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-center justify-center h-28">
                  <span className="[writing-mode:vertical-rl] rotate-180 font-bold uppercase tracking-wider text-[10px] sm:text-xs text-slate-600">
                    Actual No Stroke
                  </span>
                </div>
                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-center justify-center h-28 mt-2">
                  <span className="[writing-mode:vertical-rl] rotate-180 font-bold uppercase tracking-wider text-[10px] sm:text-xs text-slate-600">
                    Actual Stroke
                  </span>
                </div>
              </div>

              {/* 2x2 Cell Quad */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                {/* Cell 1: True Negative (TN) */}
                <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col justify-between h-28 transition-all hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      True Negative (TN)
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-950 font-mono">
                    {tn}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Correctly classified as healthy
                  </div>
                </div>

                {/* Cell 2: False Positive (FP) - Type I Error */}
                <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 flex flex-col justify-between h-28 transition-all hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      False Positive (FP)
                    </span>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-amber-950 font-mono">
                    {fp}
                  </div>
                  <div className="text-[11px] text-amber-700">
                    Type I Error (False Alarm)
                  </div>
                </div>

                {/* Cell 3: False Negative (FN) - Type II Error (Critical!) */}
                <div className="bg-rose-50/90 border-2 border-rose-300 rounded-2xl p-4 flex flex-col justify-between h-28 transition-all hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                      False Negative (FN)
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white">
                      CRITICAL
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-rose-950 font-mono">
                    {fn}
                  </div>
                  <div className="text-[11px] text-rose-700">
                    Type II Error (Missed Stroke!)
                  </div>
                </div>

                {/* Cell 4: True Positive (TP) */}
                <div className="bg-blue-50/90 border-2 border-blue-300 rounded-2xl p-4 flex flex-col justify-between h-28 transition-all hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                      True Positive (TP)
                    </span>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-blue-950 font-mono">
                    {tp}
                  </div>
                  <div className="text-[11px] text-blue-700">
                    Correctly detected stroke risks
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-2 font-mono">
              Total Test Patients Evaluated: {total}
            </div>
          </div>
        </div>

        {/* Derived Clinical Metrics Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Calculated Diagnostic Metrics ({currentModel.shortName})
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Sensitivity / Recall (TPR):</span>
                  <span className="font-bold text-teal-700">{sensitivity.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${sensitivity}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">TP / (TP + FN) = {tp} / {tp + fn}</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Specificity (True Negative Rate):</span>
                  <span className="font-bold text-indigo-700">{specificity.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${specificity}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">TN / (TN + FP) = {tn} / {tn + fp}</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Precision (PPV):</span>
                  <span className="font-bold text-blue-700">{precisionVal.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${precisionVal}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">TP / (TP + FP) = {tp} / {tp + fp}</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Overall Accuracy:</span>
                  <span className="font-bold text-emerald-700">{accuracyCalc.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${accuracyCalc}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>False Negative Impact ({fn} cases):</strong> In clinical stroke prediction, <strong>{fn} patients</strong> would have been incorrectly discharged as low-risk despite having true risk factors. Minimizing this cell is the primary goal of selecting our best model.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
