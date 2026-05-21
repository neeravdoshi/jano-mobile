export type PatientProfile = {
  diagnosis: string;
  diagnosisSince: string;
  clinicalAssessment: string;
  primaryPhysician: string;
  specialty: string;
  regimen: string;
  bloodGroup: string;
  allergies: string;
  keyFindings: string[];
  activeMedications: number;
  lastReview: string;
};

export const patientProfiles: Record<string, PatientProfile> = {
  "pt-001": {
    diagnosis: "CKD Stage 5, Dialysis-dependent",
    diagnosisSince: "Sep 2025",
    clinicalAssessment:
      "42F on MHD 3×/week since dialysis initiation in Sep 2025. Anaemia is stable under EPO; Metformin stopped at initiation due to contraindication. Amlodipine currently on hold following a hypotensive episode during last MHD week — restart pending home BP log review. Insulin glargine dose recently reduced from 14 IU. Potassium trending elevated; dietary compliance to be reviewed at next session.",
    primaryPhysician: "Dr. Mehta",
    specialty: "Nephrology",
    regimen: "MHD · 3× / week",
    bloodGroup: "B+",
    allergies: "Sulfonamides",
    keyFindings: ["K+ 5.3 mEq/L elevated", "Hb stable on EPO", "BP 140/90 last session"],
    activeMedications: 5,
    lastReview: "08 Apr 2026",
  },
};
