import type { ClinicalNote, NoteSection, NoteType } from "./types";

export const noteTypeLabels: Record<NoteType, string> = {
  progress: "Progress note",
  assessment: "Initial assessment",
  discharge: "Discharge summary",
};

export const noteTypeEyebrows: Record<NoteType, string> = {
  progress: "Progress note",
  assessment: "Initial assessment",
  discharge: "Discharge summary",
};

export const defaultSectionsByType: Record<NoteType, NoteSection[]> = {
  progress: [
    { label: "Subjective", value: "" },
    { label: "Objective", value: "" },
    { label: "Assessment", value: "" },
    { label: "Plan", value: "" },
  ],
  assessment: [
    { label: "Chief complaint", value: "" },
    { label: "History", value: "" },
    { label: "Findings", value: "" },
    { label: "Impression", value: "" },
    { label: "Plan", value: "" },
  ],
  discharge: [
    { label: "Hospital course", value: "" },
    { label: "Condition at discharge", value: "" },
    { label: "Discharge medications", value: "" },
    { label: "Follow-up", value: "" },
  ],
};

export const clinicalNotes: ClinicalNote[] = [
  {
    id: "note-progress-13-apr-am",
    type: "progress",
    status: "signed",
    title: "Morning ward round",
    timestamp: "09:45 AM",
    dateLabel: "13 Apr 2026",
    groupLabel: "Today",
    author: "Dr. Mehta",
    specialty: "Nephrology",
    summary: "Bilateral edema is improving. Patient tolerated the last dialysis session and blood pressure remains stable.",
    highlights: ["Weight down 0.8 kg", "No dyspnea overnight"],
    sections: [
      { label: "Subjective", value: "Feels lighter after dialysis. No breathlessness overnight." },
      { label: "Objective", value: "Pedal edema reduced. BP stable. Urine output remains low but unchanged." },
      { label: "Assessment", value: "Volume status improving after dialysis initiation." },
      { label: "Plan", value: "Continue current dialysis schedule. Repeat BP log and monitor post-session cramps." },
    ],
  },
  {
    id: "note-progress-13-apr-pm",
    type: "progress",
    status: "signed",
    title: "Evening review",
    timestamp: "07:10 PM",
    dateLabel: "13 Apr 2026",
    groupLabel: "Today",
    author: "Dr. Rao",
    specialty: "ICU Duty",
    summary: "No respiratory distress. Patient remains hemodynamically stable with adequate oral intake.",
    highlights: ["Afebrile", "No access-site concern"],
    sections: [
      { label: "Subjective", value: "No new complaints. Appetite fair." },
      { label: "Objective", value: "No distress. Catheter site clean. Saturation normal on room air." },
      { label: "Assessment", value: "Stable post-dialysis observation." },
      { label: "Plan", value: "Continue overnight monitoring and hand over for next nephrology review." },
    ],
  },
  {
    id: "note-assessment-12-apr",
    type: "assessment",
    status: "signed",
    title: "Admission assessment",
    timestamp: "11:20 AM",
    dateLabel: "12 Apr 2026",
    groupLabel: "Yesterday",
    author: "Dr. Mehta",
    specialty: "Nephrology",
    summary: "Admitted with fluid overload and advanced CKD. Workup consistent with dialysis-dependent renal failure.",
    highlights: ["Pulmonary edema on arrival", "Outside labs reviewed"],
    sections: [
      { label: "Chief complaint", value: "Breathlessness, leg swelling, reduced urine output." },
      { label: "History", value: "Known CKD with recent worsening fatigue and poor exercise tolerance." },
      { label: "Findings", value: "Fluid overload, anemia, elevated creatinine, persistent hyperkalemia risk." },
      { label: "Impression", value: "Advanced CKD with need for urgent dialysis planning." },
      { label: "Plan", value: "Admit, monitor volume status, begin dialysis schedule, optimize renal medications." },
    ],
  },
  {
    id: "note-discharge-28-sep",
    type: "discharge",
    status: "signed",
    title: "Dialysis initiation discharge summary",
    timestamp: "03:30 PM",
    dateLabel: "28 Sep 2025",
    groupLabel: "Earlier",
    author: "Dr. Mehta",
    specialty: "Nephrology",
    summary: "Discharged after initial dialysis stabilization with catheter care instructions and follow-up schedule.",
    highlights: ["MHD plan confirmed", "Review in 72 hr"],
    sections: [
      { label: "Hospital course", value: "Patient underwent catheter placement and supervised dialysis initiation without major complication." },
      { label: "Condition at discharge", value: "Hemodynamically stable with improved breathlessness and edema." },
      { label: "Discharge medications", value: "Continue torsemide, calcium acetate, and bicarbonate as advised." },
      { label: "Follow-up", value: "Return for dialysis as scheduled and review catheter site in 72 hours." },
    ],
  },
  {
    id: "note-progress-draft",
    type: "progress",
    status: "draft",
    title: "Post-dialysis review draft",
    timestamp: "Started 08:10 AM",
    dateLabel: "14 Apr 2026",
    groupLabel: "Drafts",
    author: "Dr. Mehta",
    specialty: "Nephrology",
    summary: "Draft note prepared for the next round after reviewing new sugars and volume status.",
    highlights: ["Draft not signed"],
    sections: [
      { label: "Subjective", value: "Patient reports less heaviness today." },
      { label: "Objective", value: "Awaiting current post-dialysis vitals and sugar readings." },
      { label: "Assessment", value: "" },
      { label: "Plan", value: "" },
    ],
  },
];
