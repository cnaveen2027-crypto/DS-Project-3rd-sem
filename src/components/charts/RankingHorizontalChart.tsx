import React from 'react';
import { ModelEvaluation } from '../../types/ml';
import { rankAlgorithms } from '../../data/modelsData';
import { Trophy, CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  onSelectModelForPrediction?: (modelId: string) => void;
}

export const RankingHorizontalChart: React.FC<Props> = ({ models, onSelectModelForPrediction }) => {
  const rankedList = rankAlgorithms(models);

  // Maximum composite score for percentage calculation
  const maxScore = Math.max(...rankedList.map((m) => m.compositeScore));
  const minScore = 75; // Baseline to show clear horizontal variance

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-300 text-sm shadow-xs">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 text-sm shadow-xs">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-900/10 text-amber-900 font-bold border border-amber-900/20 text-sm shadow-xs">
            🥉
          </span>
        );
      default:
        return (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Graph 5
            </span>
            <h3 className="text-lg font-bold text-slate-900">Algorithm Selection & Visual Ranking</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Horizontal ranking based on multi-criteria clinical evaluation (ROC-AUC 40%, F1 30%, Recall 20%, Accuracy 10%)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Automatically Determines Best Model</span>
        </div>
      </div>

      {/* Horizontal Bar Chart List */}
      <div className="space-y-4">
        {rankedList.map((item) => {
          const isTop = item.rank === 1;
          const scorePercent = Math.max(15, ((item.compositeScore - minScore) / (100 - minScore)) * 100);

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isTop
                  ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border-emerald-300 ring-1 ring-emerald-400/30 shadow-xs'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                {/* Rank + Name */}
                <div className="flex items-center gap-3">
                  {getRankBadge(item.rank)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isTop ? 'text-emerald-950 text-base' : 'text-slate-800'}`}>
                        {item.name}
                      </span>
                      {isTop && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white shadow-xs">
                          Selected Best Model
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                      <span>Acc: <strong className="text-slate-700">{item.accuracy.toFixed(1)}%</strong></span>
                      <span>F1: <strong className="text-slate-700">{item.f1Score.toFixed(1)}%</strong></span>
                      <span>ROC-AUC: <strong className="text-slate-700">{item.rocAuc.toFixed(1)}%</strong></span>
                      <span>Recall: <strong className="text-slate-700">{item.recall.toFixed(1)}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Score Pill & Optional Action */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Composite Score</span>
                    <span className={`text-base font-extrabold font-mono ${isTop ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {item.compositeScore.toFixed(2)} / 100
                    </span>
                  </div>
                  {onSelectModelForPrediction && (
                    <button
                      onClick={() => onSelectModelForPrediction(item.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
                        isTop
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={`Use ${item.shortName} for risk prediction`}
                    >
                      <span>Predict</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Horizontal Bar Graphic */}
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isTop
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-sm'
                      : item.rank === 2
                      ? 'bg-gradient-to-r from-blue-600 to-sky-400'
                      : item.rank === 3
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-400'
                      : 'bg-gradient-to-r from-slate-500 to-slate-400'
                  }`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <strong>Automated Selection Logic:</strong> StrokeCare AI dynamically ranks each algorithm by evaluating a multi-objective clinical loss. <strong>{rankedList[0].name}</strong> achieved rank #1 due to its superior generalization, maximizing positive stroke detection (Recall: {rankedList[0].recall}%) while minimizing false alarms (Precision: {rankedList[0].precision}%).
        </div>
      </div>
    </div>
  );
};
