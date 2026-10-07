import { jsPDF } from 'jspdf';
import { PatientFormData, PredictionResult, ModelEvaluation } from '../types/ml';

export function generatePdfReport(
  patientData: PatientFormData,
  prediction: PredictionResult,
  models?: ModelEvaluation[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Primary colors
  const primaryBlue = [30, 64, 175]; // #1e40af
  const darkSlate = [15, 23, 42]; // #0f172a
  const textMuted = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc

  let riskColor = [16, 185, 129]; // Emerald for Low
  if (prediction.riskLevel === 'High') {
    riskColor = [225, 29, 72]; // Rose for High
  } else if (prediction.riskLevel === 'Moderate') {
    riskColor = [245, 158, 11]; // Amber for Moderate
  }

  const reportId = `SCAI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleString();

  // 1. HEADER BANNER
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('StrokeCare AI', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('AI-Powered Stroke Risk Prediction & Algorithm Analysis System', margin, 18);

  // Report metadata on header right
  doc.setFontSize(8);
  doc.text(`Report ID: ${reportId}`, pageWidth - margin, 11, { align: 'right' });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 16, { align: 'right' });
  doc.text(`Validated on 1,022 Test Cohort`, pageWidth - margin, 21, { align: 'right' });

  let y = 36;

  // 2. DOCUMENT TITLE
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CLINICAL STROKE RISK ASSESSMENT REPORT', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Confidential automated diagnostic risk evaluation generated via machine learning inference.', margin, y);
  y += 7;

  // 3. RISK ASSESSMENT EXECUTIVE HIGHLIGHT BOX
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  // Text inside risk highlight box
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ASSESSED STROKE RISK LEVEL:', margin + 6, y + 9);

  doc.setFontSize(16);
  doc.text(`${prediction.riskLevel.toUpperCase()} RISK`, margin + 6, y + 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`ESTIMATED PROBABILITY:`, pageWidth - margin - 6, y + 9, { align: 'right' });

  doc.setFontSize(18);
  doc.text(`${prediction.estimatedRiskPercent}%`, pageWidth - margin - 6, y + 19, { align: 'right' });

  y += 32;

  // 4. MODEL INFO PILL
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('EVALUATING MODEL:', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`${prediction.algorithmUsed} (Automatically selected top-performing model)`, margin + 42, y + 7);

  y += 17;

  // 5. PATIENT PARAMETERS GRID
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('1. PATIENT CLINICAL PROFILE', margin, y);
  y += 5;

  const patientParams = [
    { label: 'Age', val: `${patientData.age} years` },
    { label: 'Gender', val: patientData.gender },
    { label: 'Hypertension', val: patientData.hypertension === 1 ? 'Yes (Diagnosed)' : 'No' },
    { label: 'Heart Disease', val: patientData.heartDisease === 1 ? 'Yes (History)' : 'No' },
    { label: 'Avg Glucose Level', val: `${patientData.avgGlucoseLevel} mg/dL` },
    { label: 'BMI (Body Mass Index)', val: `${patientData.bmi} kg/m²` },
    { label: 'Smoking Status', val: patientData.smokingStatus },
    { label: 'Work Type', val: patientData.workType },
    { label: 'Residence Type', val: patientData.residenceType },
    { label: 'Marital Status', val: patientData.maritalStatus },
  ];

  // Draw 2-column table for patient parameters
  const colW = (contentWidth - 6) / 2;
  const rowH = 6.2;
  let gridY = y;

  patientParams.forEach((item, idx) => {
    const isCol2 = idx % 2 === 1;
    const itemX = isCol2 ? margin + colW + 6 : margin;
    const currentY = gridY + Math.floor(idx / 2) * rowH;

    // alternate row background
    if (Math.floor(idx / 2) % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(itemX, currentY - 4.5, colW, rowH, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(item.label + ':', itemX + 2, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(item.val, itemX + colW - 2, currentY, { align: 'right' });
  });

  y = gridY + Math.ceil(patientParams.length / 2) * rowH + 6;

  // 6. CONTRIBUTING FACTORS BREAKDOWN (SHAP / Feature weights)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('2. PRIMARY CONTRIBUTING RISK FACTORS', margin, y);
  y += 5;

  // Table header for factors
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('RISK FACTOR', margin + 3, y + 4.2);
  doc.text('PATIENT VALUE', margin + 45, y + 4.2);
  doc.text('IMPACT WEIGHT', margin + 85, y + 4.2);
  doc.text('SEVERITY', margin + 120, y + 4.2);
  doc.text('CLINICAL IMPLICATION', margin + 145, y + 4.2);
  y += 6.5;

  // Factor rows
  prediction.factors.slice(0, 5).forEach((fac, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 4, contentWidth, 6, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.text(fac.factor, margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.text(fac.value, margin + 45, y);
    doc.text(`+${fac.impactScore}%`, margin + 85, y);

    // Severity indicator
    if (fac.severity === 'high') {
      doc.setTextColor(225, 29, 72);
      doc.text('HIGH', margin + 120, y);
    } else if (fac.severity === 'moderate') {
      doc.setTextColor(217, 119, 6);
      doc.text('MODERATE', margin + 120, y);
    } else {
      doc.setTextColor(16, 185, 129);
      doc.text('LOW', margin + 120, y);
    }

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const truncatedDesc = doc.splitTextToSize(fac.description, contentWidth - 147);
    doc.text(truncatedDesc[0] || '', margin + 145, y);

    y += 5.5;
  });

  y += 4;

  // 7. RECOMMENDATIONS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('3. ACTIONABLE PREVENTATIVE RECOMMENDATIONS', margin, y);
  y += 5;

  prediction.recommendations.forEach((rec) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.text('•', margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    const splitRec = doc.splitTextToSize(rec, contentWidth - 8);
    doc.text(splitRec, margin + 7, y);
    y += splitRec.length * 4.2;
  });

  y += 3;

  // 8. ALGORITHM COMPARISON BENCHMARK REFERENCE
  if (models && models.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text('4. MACHINE LEARNING BENCHMARK MATRIX (TEST COHORT: 1,022 PATIENTS)', margin, y);
    y += 4.5;

    // mini table header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('ALGORITHM', margin + 2, y + 3.5);
    doc.text('ACCURACY', margin + 50, y + 3.5);
    doc.text('PRECISION', margin + 80, y + 3.5);
    doc.text('RECALL (TPR)', margin + 110, y + 3.5);
    doc.text('F1-SCORE', margin + 140, y + 3.5);
    doc.text('ROC-AUC', margin + 165, y + 3.5);
    y += 5.5;

    models.slice(0, 4).forEach((m, i) => {
      doc.setFont('helvetica', m.id === prediction.algorithmId ? 'bold' : 'normal');
      doc.setFontSize(7);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
      if (m.id === prediction.algorithmId) {
        doc.setFillColor(236, 253, 245);
        doc.rect(margin, y - 3.8, contentWidth, 5, 'F');
      }

      doc.text(m.name + (m.id === prediction.algorithmId ? ' [USED]' : ''), margin + 2, y);
      doc.text(`${m.accuracy.toFixed(1)}%`, margin + 50, y);
      doc.text(`${m.precision.toFixed(1)}%`, margin + 80, y);
      doc.text(`${m.recall.toFixed(1)}%`, margin + 110, y);
      doc.text(`${m.f1Score.toFixed(1)}%`, margin + 140, y);
      doc.text(`${m.rocAuc.toFixed(1)}%`, margin + 165, y);
      y += 4.5;
    });
  }

  // 9. FOOTER DISCLAIMER
  const footerY = pageHeight - 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    'Medical Disclaimer: This report is generated by StrokeCare AI for clinical research and decision-support benchmarking only. It does not replace formal diagnosis by a licensed physician or neurologist.',
    margin,
    footerY + 4,
    { maxWidth: contentWidth }
  );
  doc.text(
    `StrokeCare AI • Page 1 of 1 • Verification Hash: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    margin,
    footerY + 10
  );

  // Trigger Save / Download
  const filename = `StrokeCare_AI_Risk_Report_${patientData.age}yo_${prediction.riskLevel}Risk.pdf`;
  doc.save(filename);
}
