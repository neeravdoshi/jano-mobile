import { ChevronRight } from "lucide-react";

import { Card } from "../../../design-system/components/Card";
import { Pill } from "../../../design-system/components/Pill";
import type { Patient } from "../types";

function toneForStatus(status: Patient["status"]) {
  switch (status) {
    case "Priority":
      return "danger";
    case "In consult":
      return "success";
    default:
      return "neutral";
  }
}

export function PatientRow({ patient }: { patient: Patient }) {
  return (
    <Card className="patient-row">
      <div className="patient-row__main">
        <div className="patient-row__identity">
          <p className="patient-row__name">{patient.name}</p>
          <p className="patient-row__meta">
            {patient.age}y, {patient.gender} · {patient.concern}
          </p>
        </div>
        <ChevronRight size={18} className="patient-row__chevron" />
      </div>
      <div className="patient-row__footer">
        <Pill tone={toneForStatus(patient.status)}>{patient.status}</Pill>
        <span>{patient.appointmentTime}</span>
        <span>Last visit {patient.lastVisit}</span>
      </div>
    </Card>
  );
}
