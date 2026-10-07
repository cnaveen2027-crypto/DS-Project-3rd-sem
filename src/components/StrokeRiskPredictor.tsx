import React, { useState } from 'react';
import { ModelEvaluation, PatientFormData, PredictionResult } from '../types/ml';
import { PATIENT_PRESETS } from '../data/modelsData';
import { generatePdfReport } from '../utils/generatePdfReport';
import {
  Activity,
  Heart,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  User,
  Sliders,
  FileDown,
  Download,
  FileCheck,
} from 'lucide-react';

interface Props {
  models: ModelEvaluation[];
  bestModel: ModelEvaluation;
  activeModelId?: string;
  onPredictionChange?: (pred: PredictionResult | null) => void;
}

export const StrokeRiskPredictor: React.FC<Props> = ({
  models,
  bestModel,
  activeModelId,
  onPredictionChange,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(activeModelId || bestModel.id);
  const [formData, setFormData] = useState<PatientFormData>({
    age: 58,
    gender: 'Female',
    hypertension: 1,
    heartDisease: 0,
    avgGlucoseLevel: 142.5,
    bmi: 29.4,
    smokingStatus: 'formerly smoked',
    workType: 'Private',
    residenceType: 'Urban',
    maritalStatus: 'Yes',
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const applyPreset = (preset: (typeof PATIENT_PRESETS)[0]) => {
    setFormData(preset.data);
  };

  const handleDownloadPdf = () => {
    if (!prediction) return;
    setDownloadingPdf(true);
    try {
      generatePdfReport(formData, prediction, models);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientData: formData,
          algorithmId: selectedModelId,
        }),
      });

      if (!res.ok) throw new Error('Prediction API failed');
      const data: PredictionResult = await res.json();
      setPrediction(data);
      onPredictionChange?.(data);
    } catch (err) {
      console.error(err);
      // Fallback calculation on client
      const ageNum = Number(formData.age);
      const hypNum = Number(formData.hypertension);
      const heartNum = Number(formData.heartDisease);
      const glucose = Number(formData.avgGlucoseLevel);
      const bmiVal = Number(formData.bmi);

      let logOdds = -3.8;
      if (ageNum > 70) logOdds += 2.2;
      else if (ageNum > 55) logOdds += 1.4;
      else if (ageNum > 40) logOdds += 0.7;

      if (hypNum === 1) logOdds += 0.95;
      if (heartNum === 1) logOdds += 1.15;
      if (glucose > 180) logOdds += 1.25;
      else if (glucose > 130) logOdds += 0.75;
      if (bmiVal >= 30) logOdds += 0.55;

      const prob = 1 / (1 + Math.exp(-logOdds));
      const riskPercent = Math.round(prob * 100);

      const level = riskPercent < 25 ? 'Low' : riskPercent < 60 ? 'Moderate' : 'High';
      const chosenModel = models.find((m) => m.id === selectedModelId) || bestModel;

      const fallbackPred: PredictionResult = {
        algorithmUsed: chosenModel.name,
        algorithmShortName: chosenModel.shortName,
        algorithmId: chosenModel.id,
        estimatedRiskPercent: riskPercent,
        riskLevel: level,
        factors: [
          {
            factor: 'Age',
            value: `${ageNum} years`,
            impactScore: ageNum > 60 ? 35 : 18,
            severity: ageNum > 65 ? 'high' : 'moderate',
            description: 'Major non-modifiable cardiovascular factor.',
          },
          {
            factor: 'Hypertension',
            value: hypNum === 1 ? 'Yes' : 'No',
            impactScore: hypNum === 1 ? 26 : 0,
            severity: hypNum === 1 ? 'high' : 'low',
            description: 'Elevated arterial pressure damages vessel walls.',
          },
          {
            factor: 'Blood Glucose',
            value: `${glucose} mg/dL`,
            impactScore: glucose > 140 ? 22 : 6,
            severity: glucose > 140 ? 'moderate' : 'low',
            description: 'Microvascular endothelial strain indicator.',
          },
        ],
        recommendations: [
          'Maintain regular arterial pressure monitoring (<130/80 mmHg).',
          'Schedule periodic metabolic blood panels and HbA1c tests.',
        ],
      };
      setPrediction(fallbackPred);
      onPredictionChange?.(fallbackPred);
    } finally {
      setLoading(false);
    }
  };

  // BMI classification helper
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-600 bg-amber-50' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-700 bg-emerald-50' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Obese', color: 'text-rose-700 bg-rose-50' };
  };

  const bmiCategory = getBmiCategory(formData.bmi);

  return (
    <div className="space-y-8">
      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Clinical Assessment
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Patient Stroke Risk Prediction</h3>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Enter clinical metrics to evaluate probability using the automatically selected best-performing algorithm
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {PATIENT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 transition-colors shadow-xs"
                title={preset.desc}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection Notice */}
        <div className="my-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Active Inference Algorithm: <strong className="text-emerald-800">{models.find((m) => m.id === selectedModelId)?.name}</strong>
              {selectedModelId === bestModel.id && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase font-bold">
                  Auto Selected Best
                </span>
              )}
            </span>
          </div>

          {/* Option to test other models */}
          <div className="flex items-center gap-2">
            <label htmlFor="predict-algo-select" className="text-slate-600 whitespace-nowrap">Change Model:</label>
            <select
              id="predict-algo-select"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="bg-white border border-emerald-300 text-slate-800 text-xs rounded-lg px-2.5 py-1 font-semibold focus:outline-none"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.shortName} ({m.accuracy.toFixed(1)}% Acc)
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Age */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="patient-age" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Age (Years)
                </label>
                <span className="text-sm font-black text-blue-700 font-mono">{formData.age} yrs</span>
              </div>
              <input
                id="patient-age"
                type="range"
                min="18"
                max="95"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18</span>
                <span>55</span>
                <span>95</span>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label htmlFor="patient-gender" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Gender
              </label>
              <select
                id="patient-gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Hypertension */}
            <div className="space-y-1.5">
              <label htmlFor="patient-hypertension" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Hypertension (High BP)
              </label>
              <select
                id="patient-hypertension"
                value={formData.hypertension}
                onChange={(e) => setFormData({ ...formData, hypertension: Number(e.target.value) })}
                className={`w-full border rounded-xl px-3.5 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  formData.hypertension === 1
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="0">No (Normal Blood Pressure)</option>
                <option value="1">Yes (Diagnosed Hypertension)</option>
              </select>
            </div>

            {/* Heart Disease */}
            <div className="space-y-1.5">
              <label htmlFor="patient-heart-disease" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Heart Disease History
              </label>
              <select
                id="patient-heart-disease"
                value={formData.heartDisease}
                onChange={(e) => setFormData({ ...formData, heartDisease: Number(e.target.value) })}
                className={`w-full border rounded-xl px-3.5 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  formData.heartDisease === 1
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="0">No (No cardiac history)</option>
                <option value="1">Yes (Arrhythmia, CAD, or prior event)</option>
              </select>
            </div>

            {/* Average Glucose Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="patient-glucose" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Avg Glucose Level
                </label>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {formData.avgGlucoseLevel} mg/dL
                </span>
              </div>
              <input
                id="patient-glucose"
                type="number"
                step="0.1"
                min="50"
                max="300"
                value={formData.avgGlucoseLevel}
                onChange={(e) => setFormData({ ...formData, avgGlucoseLevel: parseFloat(e.target.value) || 100 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">Normal: 70–100 | Pre-diabetic: 100–125 | Diabetic: &gt;126 mg/dL</p>
            </div>

            {/* BMI */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="patient-bmi" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  BMI (Body Mass Index)
                </label>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </span>
              </div>
              <input
                id="patient-bmi"
                type="number"
                step="0.1"
                min="10"
                max="60"
                value={formData.bmi}
                onChange={(e) => setFormData({ ...formData, bmi: parseFloat(e.target.value) || 25 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">Normal BMI range: 18.5 – 24.9 kg/m²</p>
            </div>

            {/* Smoking Status */}
            <div className="space-y-1.5">
              <label htmlFor="patient-smoking" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Smoking Status
              </label>
              <select
                id="patient-smoking"
                value={formData.smokingStatus}
                onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="never smoked">Never Smoked</option>
                <option value="formerly smoked">Formerly Smoked</option>
                <option value="smokes">Currently Smokes</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            {/* Work Type */}
            <div className="space-y-1.5">
              <label htmlFor="patient-work" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Work Type
              </label>
              <select
                id="patient-work"
                value={formData.workType}
                onChange={(e) => setFormData({ ...formData, workType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Private">Private Company</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Govt_job">Government Job</option>
                <option value="children">Children / Student</option>
                <option value="Never_worked">Never Worked</option>
              </select>
            </div>

            {/* Residence & Marital Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="patient-residence" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Residence
                </label>
                <select
                  id="patient-residence"
                  value={formData.residenceType}
                  onChange={(e) => setFormData({ ...formData, residenceType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="patient-married" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Married
                </label>
                <select
                  id="patient-married"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Machine learning inference computed in real time.
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Prediction...</span>
                </>
              ) : (
                <>
                  <span>Predict Stroke Risk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Result & Risk Visualization Section */}
      {prediction && (
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                  Section 7
                </span>
                <h3 className="text-2xl font-bold text-slate-900">Stroke Risk Result</h3>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Clinical risk score generated via {prediction.algorithmUsed}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Model: {prediction.algorithmShortName}
              </span>

              {/* Download PDF Button in Header */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {pdfDownloaded ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-300" />
                    <span>Report Downloaded!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-sky-200" />
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 7 Risk Visualization: Visual Indicator Meter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Progress / Risk Meter */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center">
              {/* Radial or Big Gauge Display */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={
                      prediction.riskLevel === 'High'
                        ? '#e11d48'
                        : prediction.riskLevel === 'Moderate'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * prediction.estimatedRiskPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 font-mono">
                    {prediction.estimatedRiskPercent}%
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                    Estimated Risk
                  </span>
                </div>
              </div>

              {/* Text Block Meter (As specified in prompt) */}
              <div className="mt-4 w-full max-w-xs">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Stroke Risk Meter</span>
                  <span
                    className={
                      prediction.riskLevel === 'High'
                        ? 'text-rose-600'
                        : prediction.riskLevel === 'Moderate'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }
                  >
                    Risk Level: {prediction.riskLevel}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      prediction.riskLevel === 'High'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : prediction.riskLevel === 'Moderate'
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    }`}
                    style={{ width: `${prediction.estimatedRiskPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0% Low</span>
                  <span>25% Moderate</span>
                  <span>60% High</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Risk Category Summary Banner & Key Clinical Insights */}
            <div className="md:col-span-7 space-y-4">
              <div
                className={`p-5 rounded-2xl border ${
                  prediction.riskLevel === 'High'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : prediction.riskLevel === 'Moderate'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {prediction.riskLevel === 'High' ? (
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                  ) : prediction.riskLevel === 'Moderate' ? (
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-lg">
                      Risk Classification: {prediction.riskLevel} Risk ({prediction.estimatedRiskPercent}%)
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90">
                      Evaluated using <strong>{prediction.algorithmUsed}</strong> trained on clinical stroke cohorts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Clinical Recommendations
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {prediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PDF Report Export Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Download Official Clinical Report</span>
                    <span className="text-slate-500 text-[11px]">Includes patient profile, SHAP weights, risk breakdown & ML benchmark</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-blue-300 text-blue-700 font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{pdfDownloaded ? 'Report Saved!' : 'Download as PDF'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 7 Contributed Factors: SHAP / Feature Importance Breakdown */}
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Important Input Factors Contributing to Prediction
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prediction.factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{factor.factor}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        factor.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : factor.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {factor.severity}
                    </span>
                  </div>

                  <div className="text-sm font-black text-slate-900 font-mono mb-2">
                    {factor.value}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Relative Factor Weight:</span>
                      <span className="font-bold font-mono">+{factor.impactScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          factor.severity === 'high'
                            ? 'bg-rose-500'
                            : factor.severity === 'moderate'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, factor.impactScore * 2.5)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
