export type MedicationStatus = "ongoing" | "paused" | "completed";

export type Medication = {
  id: string;
  name: string;
  brand: string;
  classCode: string;
  form: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  reviewDate: string;
  status: MedicationStatus;
  indication: string;
  prescribedBy: string;
  specialty: string;
  lastUpdated: string;
  tone: "cool" | "mint" | "gold" | "ink";
};
