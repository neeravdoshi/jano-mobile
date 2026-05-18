export type NoteType = "progress" | "assessment" | "discharge";

export type NoteStatus = "signed" | "draft";

export type NoteSection = {
  label: string;
  value: string;
};

export type ClinicalNote = {
  id: string;
  type: NoteType;
  status: NoteStatus;
  title: string;
  timestamp: string;
  dateLabel: string;
  groupLabel: string;
  author: string;
  specialty: string;
  summary: string;
  highlights?: string[];
  sections: NoteSection[];
};
