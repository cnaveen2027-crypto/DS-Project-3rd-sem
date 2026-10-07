import React, { useState } from 'react';
import { ModelEvaluation, MetricKey } from '../types/ml';
import { Award, ArrowUpDown, ChevronDown, ChevronUp, Download, Info } from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  bestModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const AlgorithmComparisonTable: React.FC<Props> = ({
  models,
  bestModelId,
  onSelectModel,
}) => {
  const [sortKey, setSortKey] = useState<MetricKey | 'name'>('rocAuc');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: MetricKey | 'name') => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedModels = [...models].sort((a, b) => {
    if (sortKey === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    const valA = a[sortKey];
    const valB = b[sortKey];
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const exportCSV = () => {
    const headers = ['Algorithm', 'Accuracy (%)', 'Precision (%)', 'Recall (%)', 'F1-Score (%)', 'ROC-AUC (%)', 'Training Time (s)'];
    const rows = sortedModels.map((m) => [
      `"${m.name}"`,
      m.accuracy.toFixed(2),
      m.precision.toFixed(2),
      m.recall.toFixed(2),
      m.f1Score.toFixed(2),
      m.rocAuc.toFixed(2),
      m.trainingTimeSec.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'strokecare_algorithm_benchmark_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Benchmark Table
            </span>
            <h3 className="text-xl font-bold text-slate-900">Machine Learning Algorithm Comparison</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Empirical evaluation metrics calculated from 1,022 stratified test patients (Stroke dataset)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <th className="py-3.5 px-4 sm:px-6">Algorithm</th>
              <th
                onClick={() => handleSort('accuracy')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  Accuracy
                  {sortKey === 'accuracy' ? (
                    sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('precision')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  Precision
                  {sortKey === 'precision' ? (
                    sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('recall')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  Recall
                  {sortKey === 'recall' ? (
                    sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('f1Score')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  F1-Score
                  {sortKey === 'f1Score' ? (
                    sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('rocAuc')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  ROC-AUC
                  {sortKey === 'rocAuc' ? (
                    sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Inference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedModels.map((model) => {
              const isBest = model.id === bestModelId;

              return (
                <tr
                  key={model.id}
                  className={`transition-colors ${
                    isBest
                      ? 'bg-emerald-50/50 hover:bg-emerald-50/80 font-medium'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      {isBest && (
                        <span className="p-1 rounded-full bg-amber-100 text-amber-700" title="Best Overall Algorithm">
                          <Award className="w-4 h-4 fill-amber-400" />
                        </span>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          {model.name}
                          {isBest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                              Top Pick
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 max-w-sm truncate">
                          {model.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-slate-800">
                    <span className={isBest ? 'text-emerald-700 font-bold' : ''}>
                      {model.accuracy.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-slate-800">
                    <span className={isBest ? 'text-emerald-700 font-bold' : ''}>
                      {model.precision.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-slate-800">
                    <span className={isBest ? 'text-emerald-700 font-bold' : ''}>
                      {model.recall.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-slate-800">
                    <span className={isBest ? 'text-emerald-700 font-bold' : ''}>
                      {model.f1Score.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-slate-800">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      model.rocAuc >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : model.rocAuc >= 85
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {model.rocAuc.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onSelectModel(model.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs ${
                        isBest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Use Model
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>All models evaluated on identical stratified 80/20 train-test splits with SMOTE oversampling.</span>
        </div>
        <span className="font-mono text-slate-400">7 ML Architectures Compared</span>
      </div>
    </div>
  );
};
