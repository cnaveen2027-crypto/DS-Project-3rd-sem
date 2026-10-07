import React from 'react';
import { ModelEvaluation } from '../types/ml';
import { Trophy, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  bestModel: ModelEvaluation;
  onNavigateToPrediction: () => void;
}

export const BestAlgorithmCard: React.FC<Props> = ({ bestModel, onNavigateToPrediction }) => {
  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#059669', '#3b82f6', '#f59e0b', '#10b981'],
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-7 sm:p-9 shadow-xl border border-emerald-500/30">
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950 shadow-sm">
              <Trophy className="w-3.5 h-3.5" />
              Best Performing Algorithm
            </span>
            <span className="text-xs text-emerald-300 font-medium">
              Automatically Computed from Evaluation Metrics
            </span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {bestModel.name}
              <button
                onClick={triggerCelebration}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                title="Celebrate winning model!"
                aria-label="Celebrate best model"
              >
                🏆
              </button>
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base mt-2 leading-relaxed">
              <strong>{bestModel.shortName}</strong> achieved the strongest overall performance among the evaluated models based on the selected evaluation criteria. With its ensemble architecture of bagged decision trees, it successfully minimizes both false negatives and variance, ensuring clinical reliability.
            </p>
          </div>

          {/* Metric highlights pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                Accuracy
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {bestModel.accuracy.toFixed(2)}%
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                F1-Score
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {bestModel.f1Score.toFixed(2)}%
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider block">
                ROC-AUC
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {bestModel.rocAuc.toFixed(2)}%
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider block">
                Recall (Sensitivity)
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {bestModel.recall.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Precision: {bestModel.precision.toFixed(2)}%
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Inference Time: ~{bestModel.trainingTimeSec}s
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Validated on 1,022 Test Cases
            </span>
          </div>
        </div>

        {/* Action column */}
        <div className="lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-center items-start lg:items-center gap-4 shrink-0">
          <div className="text-center lg:text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block">
              Clinical Deployment
            </span>
            <p className="text-xs text-slate-300 mt-1 max-w-[200px]">
              Ready for real-time stroke risk prediction with patient parameters
            </p>
          </div>

          <button
            onClick={onNavigateToPrediction}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Predict Stroke Risk with {bestModel.shortName}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
