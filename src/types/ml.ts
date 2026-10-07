export interface ModelEvaluation {
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

export interface PatientFormData {
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  hypertension: number; // 0 or 1
  heartDisease: number; // 0 or 1
  avgGlucoseLevel: number; // mg/dL
  bmi: number; // kg/m^2
  smokingStatus: 'never smoked' | 'formerly smoked' | 'smokes' | 'Unknown';
  workType: 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked';
  residenceType: 'Urban' | 'Rural';
  maritalStatus: 'Yes' | 'No';
}

export interface ContributingFactor {
  factor: string;
  value: string;
  impactScore: number; // 0 to 100 percentage impact
  severity: 'high' | 'moderate' | 'low';
  description: string;
}

export interface PredictionResult {
  algorithmUsed: string;
  algorithmShortName: string;
  algorithmId: string;
  estimatedRiskPercent: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  factors: ContributingFactor[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type MetricKey = 'accuracy' | 'precision' | 'recall' | 'f1Score' | 'rocAuc';
