export type PatientStatus = "Waiting" | "In consult" | "Priority";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "F" | "M";
  status: PatientStatus;
  appointmentTime: string;
  concern: string;
  lastVisit: string;
  tags: string[];
};
