import type { Patient } from "../features/patients/types";

export const patients: Patient[] = [
  {
    id: "pt-001",
    name: "Ritika Sharma",
    age: 42,
    gender: "F",
    status: "Waiting",
    appointmentTime: "09:10",
    concern: "Post-viral fatigue, BP review",
    lastVisit: "12 Apr",
    tags: ["Follow-up", "Hypertension"]
  },
  {
    id: "pt-002",
    name: "Arjun Menon",
    age: 57,
    gender: "M",
    status: "Priority",
    appointmentTime: "09:20",
    concern: "Sugar fluctuation, foot pain",
    lastVisit: "28 Apr",
    tags: ["Diabetes", "Priority"]
  },
  {
    id: "pt-003",
    name: "Nazia Khan",
    age: 31,
    gender: "F",
    status: "In consult",
    appointmentTime: "09:30",
    concern: "Thyroid refill, sleep issue",
    lastVisit: "03 May",
    tags: ["Medication", "Lab due"]
  }
];
