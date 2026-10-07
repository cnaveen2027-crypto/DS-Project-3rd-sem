import React from 'react';
import {
  Database,
  Filter,
  Cpu,
  Calculator,
  BarChart4,
  Layers,
  Trophy,
  Stethoscope,
  PieChart,
  Bot,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const MLWorkflowSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Clinical Dataset',
      icon: <Database className="w-5 h-5 text-blue-600" />,
      tag: '5,110 Patients',
      desc: 'Kaggle Stroke Cohort including demographics, clinical blood glucose, hypertension history, and lifestyle factors.',
    },
    {
      step: 2,
      title: 'Data Preprocessing',
      icon: <Filter className="w-5 h-5 text-indigo-600" />,
      tag: 'Imputation & SMOTE',
      desc: 'Median BMI imputation by age group, One-Hot Encoding for categorical factors, and SMOTE oversampling for 4.9% positive class imbalance.',
    },
    {
      step: 3,
      title: 'Train 7 Algorithms',
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      tag: 'Cross-Validation',
      desc: 'Logistic Regression, Decision Tree, Random Forest, KNN, SVM, XGBoost, and Artificial Neural Network (ANN).',
    },
    {
      step: 4,
      title: 'Evaluate & Calculate Metrics',
      icon: <Calculator className="w-5 h-5 text-emerald-600" />,
      tag: '1,022 Test Cohort',
      desc: 'Computing Accuracy, Precision, Recall (Sensitivity), F1-Score, and ROC-AUC for every algorithm on unseen test data.',
    },
    {
      step: 5,
      title: 'Generate Visual Graphs',
      icon: <BarChart4 className="w-5 h-5 text-cyan-600" />,
      tag: '5 Visualizations',
      desc: 'Accuracy Bar Chart, Grouped Precision/Recall/F1, ROC-AUC Comparison, Dynamic Metric Explorer, and Multi-model ROC curves.',
    },
    {
      step: 6,
      title: 'Rank & Select Best Model',
      icon: <Trophy className="w-5 h-5 text-amber-600" />,
      tag: 'Automated 🥇',
      desc: 'Dynamic composite clinical scoring (ROC-AUC 40%, F1 30%, Recall 20%, Accuracy 10%) automatically crowning Random Forest.',
    },
    {
      step: 7,
      title: 'Stroke Risk Prediction',
      icon: <Stethoscope className="w-5 h-5 text-teal-600" />,
      tag: 'Active Inference',
      desc: 'Patient enters 10 clinical metrics; the top-performing model evaluates real-time risk probability percentage.',
    },
    {
      step: 8,
      title: 'Risk & Factor Visualization',
      icon: <PieChart className="w-5 h-5 text-rose-600" />,
      tag: 'Explainable AI',
      desc: 'Risk gauge meter (Low / Moderate / High) accompanied by feature contribution breakdown (Age, Glucose, BP).',
    },
    {
      step: 9,
      title: 'AI Chatbot Explanation',
      icon: <Bot className="w-5 h-5 text-blue-600" />,
      tag: 'StrokeCare Assistant',
      desc: 'Gemini AI assistant grounds responses in real benchmark figures, clarifying why accuracy is not enough in clinical ML.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            Research Architecture
          </span>
          <h3 className="text-2xl font-bold text-slate-900">End-to-End Machine Learning Workflow</h3>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Rigorous clinical data science pipeline from raw electronic health records to explainable AI decision support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div
            key={s.step}
            className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-xs font-black text-slate-400 font-mono">
                    STEP {s.step}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 shadow-xs">
                  {s.tag}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-1.5">{s.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
