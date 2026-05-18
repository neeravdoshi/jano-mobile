export type PrescriptionStatus = "draft" | "signed";

export type PrescriptionMedication = {
  id: string;
  name: string;
  form: string;
  strength: string;
  frequency: string;
  duration: string;
  timing: string;
  notes: string;
};

export type PrescriptionInvestigation = {
  id: string;
  name: string;
  category: string;
  instructions: string;
};

export type PrescriptionRecord = {
  id: string;
  title: string;
  createdAt: string;
  groupLabel: string;
  department: string;
  doctor: string;
  status: PrescriptionStatus;
  summary: string;
  complaints: string;
  diagnosis: string;
  vitals: Array<{ label: string; value: string }>;
  medications: PrescriptionMedication[];
  investigations: PrescriptionInvestigation[];
  advice: string;
  followUp: string;
  dictationPrompt: string;
};
