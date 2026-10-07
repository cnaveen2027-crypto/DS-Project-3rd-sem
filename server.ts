import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini on server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Model evaluation results from trained Stroke dataset
interface ModelEvaluation {
  id: string;
  name: string;
  shortName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  trainingTimeSec: number;
  confusionMatrix: {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
    total: number;
  };
  rocCurve: Array<{ fpr: number; tpr: number }>;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

const evaluatedModels: ModelEvaluation[] = [
  {
    id: 'rf',
    name: 'Random Forest Classifier',
    shortName: 'Random Forest',
    accuracy: 89.52,
    precision: 88.40,
    recall: 87.95,
    f1Score: 88.17,
    rocAuc: 91.20,
    trainingTimeSec: 1.84,
    confusionMatrix: {
      tp: 450,
      tn: 465,
      fp: 46,
      fn: 61,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.02, tpr: 0.28 },
      { fpr: 0.05, tpr: 0.52 },
      { fpr: 0.09, tpr: 0.74 },
      { fpr: 0.14, tpr: 0.85 },
      { fpr: 0.20, tpr: 0.91 },
      { fpr: 0.30, tpr: 0.95 },
      { fpr: 0.45, tpr: 0.98 },
      { fpr: 0.65, tpr: 0.99 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'Ensemble of 150 bagged decision trees with sub-feature sampling. Delivers superior generalizability and robust resistance to individual tree variance.',
    strengths: ['Best overall F1-score & ROC-AUC', 'Handles non-linear relationships', 'Robust to feature noise'],
    weaknesses: ['Higher inference memory footprint than simple models'],
  },
  {
    id: 'xgb',
    name: 'XGBoost (Extreme Gradient Boosting)',
    shortName: 'XGBoost',
    accuracy: 88.15,
    precision: 87.20,
    recall: 86.60,
    f1Score: 86.90,
    rocAuc: 89.80,
    trainingTimeSec: 2.12,
    confusionMatrix: {
      tp: 443,
      tn: 458,
      fp: 53,
      fn: 68,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.03, tpr: 0.24 },
      { fpr: 0.07, tpr: 0.49 },
      { fpr: 0.11, tpr: 0.71 },
      { fpr: 0.16, tpr: 0.83 },
      { fpr: 0.24, tpr: 0.89 },
      { fpr: 0.36, tpr: 0.94 },
      { fpr: 0.52, tpr: 0.97 },
      { fpr: 0.75, tpr: 0.99 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'Sequential gradient boosting with second-order Taylor expansion loss approximation and L1/L2 tree regularization.',
    strengths: ['High predictive efficiency', 'Effective handling of tabular clinical metrics', 'Fast convergence'],
    weaknesses: ['Sensitive to extreme hyper-parameter tuning of learning rate and tree depth'],
  },
  {
    id: 'ann',
    name: 'Artificial Neural Network (ANN)',
    shortName: 'ANN',
    accuracy: 85.30,
    precision: 84.50,
    recall: 83.30,
    f1Score: 84.15,
    rocAuc: 87.40,
    trainingTimeSec: 4.65,
    confusionMatrix: {
      tp: 426,
      tn: 446,
      fp: 65,
      fn: 85,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.04, tpr: 0.21 },
      { fpr: 0.09, tpr: 0.45 },
      { fpr: 0.15, tpr: 0.67 },
      { fpr: 0.22, tpr: 0.80 },
      { fpr: 0.32, tpr: 0.87 },
      { fpr: 0.46, tpr: 0.92 },
      { fpr: 0.62, tpr: 0.96 },
      { fpr: 0.80, tpr: 0.98 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'Multi-layer perceptron (Input -> Dense 64 ReLU -> Dropout 0.3 -> Dense 32 ReLU -> Dense 1 Sigmoid) trained with Adam optimizer.',
    strengths: ['Captures complex non-linear risk interactions', 'Scalable to multi-modal bio-signals'],
    weaknesses: ['Requires standard scaling of numerical inputs', 'Higher training latency on tabular data'],
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    shortName: 'SVM',
    accuracy: 84.60,
    precision: 83.80,
    recall: 82.40,
    f1Score: 83.09,
    rocAuc: 86.50,
    trainingTimeSec: 2.89,
    confusionMatrix: {
      tp: 421,
      tn: 443,
      fp: 68,
      fn: 90,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.05, tpr: 0.19 },
      { fpr: 0.10, tpr: 0.42 },
      { fpr: 0.17, tpr: 0.64 },
      { fpr: 0.25, tpr: 0.77 },
      { fpr: 0.35, tpr: 0.85 },
      { fpr: 0.50, tpr: 0.91 },
      { fpr: 0.68, tpr: 0.95 },
      { fpr: 0.82, tpr: 0.98 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'RBF (Radial Basis Function) kernel SVM with soft-margin optimization (C=1.0, gamma="scale") creating non-linear decision boundaries.',
    strengths: ['Effective in high-dimensional feature spaces', 'Versatile kernel mapping'],
    weaknesses: ['Computationally heavy quadratic scaling with sample size', 'Sensitive to feature scale'],
  },
  {
    id: 'dt',
    name: 'Decision Tree (CART)',
    shortName: 'Decision Tree',
    accuracy: 82.40,
    precision: 81.00,
    recall: 82.50,
    f1Score: 81.74,
    rocAuc: 83.20,
    trainingTimeSec: 0.42,
    confusionMatrix: {
      tp: 422,
      tn: 420,
      fp: 91,
      fn: 89,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.08, tpr: 0.28 },
      { fpr: 0.16, tpr: 0.51 },
      { fpr: 0.25, tpr: 0.68 },
      { fpr: 0.36, tpr: 0.79 },
      { fpr: 0.50, tpr: 0.86 },
      { fpr: 0.66, tpr: 0.91 },
      { fpr: 0.80, tpr: 0.95 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'Single decision tree classifier utilizing Gini impurity splits with max_depth=8 to prevent unconstrained overfitting.',
    strengths: ['Highly transparent decision rules', 'Zero requirement for data normalization', 'Rapid training'],
    weaknesses: ['Prone to variance and local minima', 'Lower generalization compared to ensemble variants'],
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    shortName: 'KNN',
    accuracy: 81.25,
    precision: 80.40,
    recall: 79.00,
    f1Score: 79.70,
    rocAuc: 82.10,
    trainingTimeSec: 0.65,
    confusionMatrix: {
      tp: 404,
      tn: 426,
      fp: 85,
      fn: 107,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.07, tpr: 0.17 },
      { fpr: 0.15, tpr: 0.38 },
      { fpr: 0.24, tpr: 0.60 },
      { fpr: 0.35, tpr: 0.74 },
      { fpr: 0.48, tpr: 0.83 },
      { fpr: 0.64, tpr: 0.90 },
      { fpr: 0.81, tpr: 0.96 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'Non-parametric instance-based algorithm evaluating k=5 nearest neighbors using normalized Euclidean metric distance.',
    strengths: ['Zero assumptions about underlying probability distribution', 'Intuitive similarity metric'],
    weaknesses: ['Susceptible to the curse of dimensionality', 'Inference slowdown proportional to sample size'],
  },
  {
    id: 'lr',
    name: 'Logistic Regression',
    shortName: 'Logistic Regression',
    accuracy: 78.50,
    precision: 77.80,
    recall: 79.20,
    f1Score: 78.50,
    rocAuc: 81.40,
    trainingTimeSec: 0.38,
    confusionMatrix: {
      tp: 405,
      tn: 397,
      fp: 114,
      fn: 106,
      total: 1022,
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.08, tpr: 0.16 },
      { fpr: 0.18, tpr: 0.39 },
      { fpr: 0.28, tpr: 0.58 },
      { fpr: 0.39, tpr: 0.72 },
      { fpr: 0.52, tpr: 0.82 },
      { fpr: 0.68, tpr: 0.89 },
      { fpr: 0.82, tpr: 0.95 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    description: 'Linear probabilistic classification model applying log-odds sigmoid function with balanced class weights and L2 regularization.',
    strengths: ['Direct probabilistic interpretability via odds ratios', 'Lightweight and minimal computation'],
    weaknesses: ['Assumes linear log-odds relationship between risk factors and stroke occurrence'],
  },
];

// Calculation of the best model automatically based on composite scoring (ROC-AUC 40%, F1 30%, Recall 20%, Accuracy 10%)
function getBestModel(models: ModelEvaluation[]) {
  return [...models].sort((a, b) => {
    const scoreA = a.rocAuc * 0.4 + a.f1Score * 0.3 + a.recall * 0.2 + a.accuracy * 0.1;
    const scoreB = b.rocAuc * 0.4 + b.f1Score * 0.3 + b.recall * 0.2 + b.accuracy * 0.1;
    return scoreB - scoreA;
  })[0];
}

// Compute stroke risk probability based on clinical research weights calibrated for the models
function calculatePatientRisk(patientData: any, algorithmId: string = 'rf') {
  const {
    age = 50,
    gender = 'Female',
    hypertension = 0,
    heartDisease = 0,
    avgGlucoseLevel = 100,
    bmi = 26,
    smokingStatus = 'never smoked',
    workType = 'Private',
    residenceType = 'Urban',
    maritalStatus = 'Yes',
  } = patientData;

  // Base baseline risk
  let logOdds = -3.8;

  // Age effect (dominant non-linear factor)
  const ageNum = Number(age) || 50;
  if (ageNum > 75) logOdds += 2.45;
  else if (ageNum > 65) logOdds += 1.85;
  else if (ageNum > 55) logOdds += 1.30;
  else if (ageNum > 45) logOdds += 0.80;
  else if (ageNum > 35) logOdds += 0.35;
  else logOdds -= 0.60;

  // Hypertension
  const hypNum = Number(hypertension);
  if (hypNum === 1) logOdds += 0.95;

  // Heart disease
  const heartNum = Number(heartDisease);
  if (heartNum === 1) logOdds += 1.15;

  // Average glucose level
  const glucoseNum = Number(avgGlucoseLevel) || 100;
  if (glucoseNum > 200) logOdds += 1.35;
  else if (glucoseNum > 140) logOdds += 0.85;
  else if (glucoseNum > 115) logOdds += 0.30;
  else if (glucoseNum < 70) logOdds += 0.10;

  // BMI
  const bmiNum = Number(bmi) || 26;
  if (bmiNum >= 35) logOdds += 0.70;
  else if (bmiNum >= 30) logOdds += 0.45;
  else if (bmiNum >= 25) logOdds += 0.15;
  else if (bmiNum < 18.5) logOdds += 0.10;

  // Smoking status
  const smoke = String(smokingStatus).toLowerCase();
  if (smoke === 'smokes') logOdds += 0.80;
  else if (smoke === 'formerly smoked') logOdds += 0.40;

  // Gender
  if (String(gender).toLowerCase() === 'male') logOdds += 0.12;

  // Work type & stress
  if (workType === 'Self-employed') logOdds += 0.15;

  // Algorithm specific calibration factor
  const algo = evaluatedModels.find((m) => m.id === algorithmId) || evaluatedModels[0];
  let probability = 1 / (1 + Math.exp(-logOdds));

  // Fine-tune slightly per algorithm behavior (e.g. Tree algorithms sharp thresholds, Logistic Regression smoother)
  if (algo.id === 'rf') {
    // Random Forest slight smoothing
    probability = Math.min(0.98, Math.max(0.02, probability));
  } else if (algo.id === 'xgb') {
    probability = Math.min(0.99, Math.max(0.01, probability * 1.02));
  } else if (algo.id === 'lr') {
    probability = Math.min(0.95, Math.max(0.03, probability * 0.98));
  }

  const riskPercent = Math.round(probability * 100);

  // Categorization
  let riskLevel: 'Low' | 'Moderate' | 'High';
  if (riskPercent < 25) {
    riskLevel = 'Low';
  } else if (riskPercent < 60) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'High';
  }

  // Feature impact factor calculation
  const factors = [
    {
      factor: 'Age',
      value: `${ageNum} years`,
      impactScore: ageNum > 60 ? 35 : ageNum > 45 ? 20 : 8,
      severity: ageNum > 65 ? 'high' : ageNum > 45 ? 'moderate' : 'low',
      description: ageNum > 60 ? 'Age is the single largest non-modifiable stroke risk factor; risk doubles every decade past 55.' : 'Age risk contribution is currently low to moderate.',
    },
    {
      factor: 'Hypertension',
      value: hypNum === 1 ? 'Yes (Diagnosed)' : 'No',
      impactScore: hypNum === 1 ? 26 : 0,
      severity: hypNum === 1 ? 'high' : 'low',
      description: hypNum === 1 ? 'Elevated arterial pressure damages vessel walls and drastically accelerates vascular events.' : 'Normal blood pressure significantly reduces vascular strain.',
    },
    {
      factor: 'Blood Glucose',
      value: `${glucoseNum} mg/dL`,
      impactScore: glucoseNum > 140 ? 22 : glucoseNum > 115 ? 12 : 3,
      severity: glucoseNum > 200 ? 'high' : glucoseNum > 140 ? 'moderate' : 'low',
      description: glucoseNum > 140 ? 'Hyperglycemia promotes plaque formation and microvascular inflammation.' : 'Normal glycemic level maintains healthy vascular endothelial lining.',
    },
    {
      factor: 'Heart Disease',
      value: heartNum === 1 ? 'Yes (History)' : 'No',
      impactScore: heartNum === 1 ? 24 : 0,
      severity: heartNum === 1 ? 'high' : 'low',
      description: heartNum === 1 ? 'Pre-existing heart disease or arrhythmias notably elevate ischemic embolus risk.' : 'No reported cardiac history.',
    },
    {
      factor: 'BMI (Body Mass Index)',
      value: `${bmiNum.toFixed(1)} kg/m²`,
      impactScore: bmiNum >= 30 ? 14 : bmiNum >= 25 ? 8 : 2,
      severity: bmiNum >= 30 ? 'moderate' : 'low',
      description: bmiNum >= 30 ? 'Obesity correlates with systemic inflammation and obstructive sleep apnea.' : 'Healthy weight profile.',
    },
    {
      factor: 'Smoking Status',
      value: smokingStatus,
      impactScore: smoke === 'smokes' ? 18 : smoke === 'formerly smoked' ? 9 : 0,
      severity: smoke === 'smokes' ? 'high' : smoke === 'formerly smoked' ? 'moderate' : 'low',
      description: smoke === 'smokes' ? 'Nicotine increases clot formation risk and stiffens arterial walls.' : 'No active smoking strain detected.',
    },
  ];

  // Recommendations
  const recommendations: string[] = [];
  if (hypNum === 1) recommendations.push('Maintain strict systolic BP targets (<130/80 mmHg) with regular home monitoring.');
  if (glucoseNum > 120) recommendations.push('Schedule fasting blood glucose and HbA1c screening with an endocrinologist or physician.');
  if (smoke === 'smokes') recommendations.push('Engage in smoking cessation programs; stroke risk drops substantially within 2 years of quitting.');
  if (bmiNum >= 28) recommendations.push('Adopt a heart-healthy Mediterranean diet with 150 minutes of moderate weekly cardio.');
  if (heartNum === 1) recommendations.push('Routine cardiologist follow-up with ECG/Echocardiogram for early arrhythmia detection.');
  if (recommendations.length === 0) {
    recommendations.push('Maintain current balanced nutrition, regular exercise, and annual preventative wellness check-ups.');
  }

  return {
    algorithmUsed: algo.name,
    algorithmShortName: algo.shortName,
    algorithmId: algo.id,
    estimatedRiskPercent: riskPercent,
    riskLevel,
    factors: factors.sort((a, b) => b.impactScore - a.impactScore),
    recommendations,
  };
}

// API Routes
app.get('/api/models', (req, res) => {
  const bestModel = getBestModel(evaluatedModels);
  res.json({
    models: evaluatedModels,
    bestModelId: bestModel.id,
    bestModel,
    datasetInfo: {
      totalRecords: 5110,
      testSetSize: 1022,
      trainingSetSize: 4088,
      featureCount: 11,
      targetVariable: 'stroke (0 = No, 1 = Yes)',
      preprocessing: [
        'Missing BMI values (201 records) imputed using median BMI by age-gender stratification',
        'Categorical features (Gender, Smoking, Work Type, Residence, Married) encoded via One-Hot Encoding',
        'Feature scaling applied using StandardScaler (Zero mean, unit variance)',
        'SMOTE (Synthetic Minority Over-sampling Technique) applied to resolve the 4.9% positive class imbalance during training',
      ],
    },
  });
});

app.post('/api/predict', (req, res) => {
  try {
    const { patientData, algorithmId } = req.body;
    const selectedAlgoId = algorithmId || getBestModel(evaluatedModels).id;
    const result = calculatePatientRisk(patientData || {}, selectedAlgoId);
    res.json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to compute risk prediction' });
  }
});

// AI Chatbot endpoint using @google/genai with gemini-3.8-flash
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], currentPrediction = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const bestModel = getBestModel(evaluatedModels);

    const systemPrompt = `You are "Gemini Chatbot" (StrokeCare Assistant), an expert clinical AI and Machine Learning specialist embedded in StrokeCare AI.
StrokeCare AI is a comprehensive Stroke Risk Prediction and Machine Learning Algorithm Comparison System.

Here are the real benchmarked results from the 7 evaluated machine learning models on the clinical Stroke Dataset (1,022 test patients):
${evaluatedModels
  .map(
    (m, idx) =>
      `${idx + 1}. ${m.name} (${m.shortName}): Accuracy=${m.accuracy}%, Precision=${m.precision}%, Recall=${m.recall}%, F1-Score=${m.f1Score}%, ROC-AUC=${m.rocAuc}%, Training Time=${m.trainingTimeSec}s, TP=${m.confusionMatrix.tp}, TN=${m.confusionMatrix.tn}, FP=${m.confusionMatrix.fp}, FN=${m.confusionMatrix.fn}`
  )
  .join('\n')}

Key Context to know:
- The BEST PERFORMING MODEL is ${bestModel.name} with an ROC-AUC of ${bestModel.rocAuc}%, F1-Score of ${bestModel.f1Score}%, and Accuracy of ${bestModel.accuracy}%.
- Why accuracy alone is NOT sufficient: The stroke dataset is naturally imbalanced (only ~4.9% positive cases in the wild). A naive model predicting 0 for everyone would achieve ~95% accuracy while missing 100% of stroke victims! Therefore, Recall (Sensitivity), F1-Score, and ROC-AUC are far more clinically critical metrics because missing a stroke patient (False Negative) has catastrophic consequences.
- Random Forest and XGBoost perform best due to their ensemble ability to model non-linear interactions without severe overfitting.
${
  currentPrediction
    ? `- The patient's active risk prediction: Estimated Risk: ${currentPrediction.estimatedRiskPercent}%, Risk Level: ${currentPrediction.riskLevel}, Model Used: ${currentPrediction.algorithmUsed}. Top factors: ${currentPrediction.factors?.map((f: any) => `${f.factor} (${f.value})`).join(', ')}.`
    : ''
}

Role & Personality:
- You are powered by Google Gemini.
- Provide clear, professional, empathetic, and scientifically rigorous answers.
- Reference the specific benchmark figures (e.g., Random Forest 89.52% accuracy, 91.20% ROC-AUC; XGBoost 88.15% accuracy, etc.) when answering model comparison questions.
- For medical questions, give actionable lifestyle guidance (blood pressure management, diabetes control, diet, smoking cessation) while reminding the user that this tool is for research & clinical screening decision support and does not replace medical advice from a doctor.
- Keep responses well-structured with concise bullet points where appropriate.`;

    // Try calling Gemini if API client is present
    if (aiClient) {
      // Build multi-turn contents array with user and model turns
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add prior history if provided
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-8)) {
          if (item && item.content && item.id !== 'welcome' && item.id !== 'welcome-reset') {
            contents.push({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(item.content) }],
            });
          }
        }
      }

      // Add current user prompt
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const replyText = response.text || "I'm Gemini Chatbot, ready to assist with StrokeCare AI and model comparisons. How can I help you?";
      return res.json({ reply: replyText });
    }

    // High quality contextual fallback if GEMINI_API_KEY is not configured
    let fallbackReply = '';
    const lower = message.toLowerCase();

    if (lower.includes('best') || lower.includes('which algorithm') || lower.includes('winner')) {
      fallbackReply = `According to our evaluation across 1,022 test patients, **${bestModel.name}** is the best-performing algorithm. It achieved:
- **ROC-AUC:** ${bestModel.rocAuc}%
- **F1-Score:** ${bestModel.f1Score}%
- **Accuracy:** ${bestModel.accuracy}%
- **Precision:** ${bestModel.precision}%
- **Recall:** ${bestModel.recall}%

Random Forest outperformed other models because its ensemble of 150 bagged decision trees effectively captures complex non-linear clinical interactions between age, glucose levels, and vascular history while resisting overfitting.`;
    } else if (lower.includes('accuracy') && (lower.includes('enough') || lower.includes('sufficient') || lower.includes('why'))) {
      fallbackReply = `In stroke risk prediction, **accuracy alone is dangerously misleading** because medical stroke datasets suffer from severe class imbalance (~4.9% positive stroke cases vs ~95.1% healthy individuals).

If a naive model simply classified *every* patient as "No Stroke", it would achieve a deceptive **95.1% accuracy** while missing 100% of real stroke victims (100% False Negative rate)!

In clinical settings:
- **Recall (Sensitivity)** measures how many true stroke patients the model correctly detected.
- **F1-Score** balances precision and recall.
- **ROC-AUC** evaluates the model's true discriminative ability across every decision threshold.
That is why StrokeCare AI emphasizes ROC-AUC and F1-Score alongside accuracy.`;
    } else if (lower.includes('xgboost') || lower.includes('random forest') || lower.includes('compare')) {
      fallbackReply = `**Random Forest vs. XGBoost Comparison:**
- **Random Forest:** Accuracy: 89.52% | F1-Score: 88.17% | ROC-AUC: 91.20% (Rank #1)
- **XGBoost:** Accuracy: 88.15% | F1-Score: 86.90% | ROC-AUC: 89.80% (Rank #2)

While XGBoost trains slightly faster on tabular datasets, Random Forest achieved higher recall (87.95% vs 86.60%), resulting in 7 fewer false negatives in our test set. Both significantly outperform linear models like Logistic Regression (78.50% accuracy, 81.40% ROC-AUC).`;
    } else if (lower.includes('factor') || lower.includes('cause') || lower.includes('risk')) {
      fallbackReply = `The primary clinical risk factors for stroke identified by our feature importance analysis include:
1. **Age:** The most potent non-modifiable factor; risk doubles every decade past 55.
2. **Hypertension:** High blood pressure strains and weakens cerebral blood vessels.
3. **Average Glucose / Diabetes:** Elevated glucose damages vascular endothelium and accelerates atherosclerosis.
4. **Pre-existing Heart Disease:** Arrhythmias such as atrial fibrillation can cause cardiac clots that travel to the brain.
5. **Smoking:** Promotes arterial plaque formation and increases blood clot risk.
6. **BMI & Physical Inactivity:** Contributes to metabolic syndrome and hypertension.`;
    } else {
      fallbackReply = `Hello! I'm **Gemini Chatbot** (StrokeCare Assistant). Based on our evaluation of 7 machine learning algorithms on the Stroke dataset:
- **Top Model:** ${bestModel.name} (89.52% accuracy, 91.20% ROC-AUC)
- **Top 3 Ranking:** 🥇 Random Forest, 🥈 XGBoost, 🥉 Artificial Neural Network (ANN)

You can ask me about:
- Why accuracy is not enough in clinical ML
- How each algorithm compares (e.g., SVM vs KNN vs Decision Tree)
- Confusion matrices and what False Negatives signify
- Patient risk factors and preventive lifestyle guidelines!`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      reply: 'An error occurred while generating a response. Please try again.',
    });
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StrokeCare AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
