export type PatientProfile = {
  diagnosis: string;
  diagnosisSince: string;
  summary: string;
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
    summary:
      "42-year-old female on maintenance haemodialysis since Sep 2025. Anaemia managed with EPO, metabolic acidosis with sodium bicarbonate, and residual hypertension. Amlodipine currently on hold after a low-pressure event during MHD week.",
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
