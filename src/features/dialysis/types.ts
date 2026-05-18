export type DialysisReadinessStatus = "ready" | "review";

export type DialysisReadinessItem = {
  id: string;
  label: string;
  value: string;
  supporting: string;
  status: DialysisReadinessStatus;
};

export type DialysisVital = {
  label: string;
  value: string;
  supporting?: string;
  tone?: "neutral" | "warning" | "danger";
};

export type DialysisPrescriptionField = {
  label: string;
  value: string;
  supporting?: string;
};

export type DialysisTimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  status: "done" | "current" | "upcoming";
};

export type DialysisSessionHistory = {
  id: string;
  date: string;
  shift: string;
  ufRemoved: string;
  preBp: string;
  postBp: string;
  outcome: string;
};

export type DialysisWorkspace = {
  patientId: string;
  shiftLabel: string;
  station: string;
  chair: string;
  unit: string;
  nephrologist: string;
  access: string;
  serology: string;
  dryWeight: string;
  preWeight: string;
  targetUf: string;
  anticoagulation: string;
  treatmentDuration: string;
  dialyzer: string;
  dialysate: string;
  bloodFlow: string;
  machineNumber: string;
  startedBy: string;
  assistedBy: string;
  readinessSummary: string;
  readinessItems: DialysisReadinessItem[];
  preVitals: DialysisVital[];
  liveVitals: DialysisVital[];
  prescriptionFields: DialysisPrescriptionField[];
  timeline: DialysisTimelineEvent[];
  recentSessions: DialysisSessionHistory[];
  notes: string[];
};
