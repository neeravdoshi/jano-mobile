import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  Droplets,
  ShieldCheck,
  Weight,
} from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Pill } from "../design-system/components/Pill";
import { motionTokens } from "../design-system/motion";
import { dialysisWorkspaces } from "../features/dialysis/data";
import type {
  DialysisPrescriptionField,
  DialysisReadinessItem,
  DialysisSessionHistory,
  DialysisVital,
} from "../features/dialysis/types";
import { patients } from "../fixtures/patients";

function readinessTone(status: DialysisReadinessItem["status"]) {
  return status === "review" ? "warning" : "success";
}

function vitalTone(tone: DialysisVital["tone"]) {
  switch (tone) {
    case "danger":
      return "dialysis-vital--danger";
    case "warning":
      return "dialysis-vital--warning";
    default:
      return "";
  }
}

function ReadinessCard({ item }: { item: DialysisReadinessItem }) {
  return (
    <article className={clsx("dialysis-readiness-card", item.status === "review" && "dialysis-readiness-card--review")}>
      <div className="dialysis-readiness-card__top">
        <p>{item.label}</p>
        <Pill tone={readinessTone(item.status)}>{item.status === "review" ? "Review" : "Ready"}</Pill>
      </div>
      <h3>{item.value}</h3>
      <span>{item.supporting}</span>
    </article>
  );
}

function VitalCard({ vital }: { vital: DialysisVital }) {
  return (
    <article className={clsx("dialysis-vital", vitalTone(vital.tone))}>
      <p>{vital.label}</p>
      <h3>{vital.value}</h3>
      {vital.supporting ? <span>{vital.supporting}</span> : null}
    </article>
  );
}

function PrescriptionFieldCard({ field }: { field: DialysisPrescriptionField }) {
  return (
    <article className="dialysis-prescription-card">
      <p>{field.label}</p>
      <h3>{field.value}</h3>
      {field.supporting ? <span>{field.supporting}</span> : null}
    </article>
  );
}

function SessionHistoryCard({ session }: { session: DialysisSessionHistory }) {
  return (
    <article className="dialysis-history-card">
      <div className="dialysis-history-card__top">
        <div>
          <h3>{session.date}</h3>
          <p>{session.shift}</p>
        </div>
        <span>{session.outcome}</span>
      </div>
      <div className="dialysis-history-card__stats">
        <div>
          <strong>{session.ufRemoved}</strong>
          <span>UF removed</span>
        </div>
        <div>
          <strong>{session.preBp}</strong>
          <span>Pre BP</span>
        </div>
        <div>
          <strong>{session.postBp}</strong>
          <span>Post BP</span>
        </div>
      </div>
    </article>
  );
}

export function DialysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];
  const workspace = dialysisWorkspaces.find((entry) => entry.patientId === patient.id) ?? dialysisWorkspaces[0];
  const [sessionStarted, setSessionStarted] = useState(false);

  const heroMetrics = useMemo(
    () => [
      { label: "Access", value: workspace.access, icon: ShieldCheck },
      { label: "Pre weight", value: workspace.preWeight, icon: Weight },
      { label: "Target UF", value: workspace.targetUf, icon: Droplets },
    ],
    [workspace.access, workspace.preWeight, workspace.targetUf]
  );

  return (
    <motion.div
      className="dialysis-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">Dialysis</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
      </header>

      <div className="dialysis-body">
        <section className="dialysis-hero">
          <div className="dialysis-hero__top">
            <div>
              <p className="eyebrow">{workspace.unit}</p>
              <h2 className="dialysis-hero__title">
                {sessionStarted ? "Session in progress" : "Ready to start"}
              </h2>
              <p className="dialysis-hero__copy">
                {sessionStarted
                  ? "Monitoring the active session with the current prescription and chairside checkpoints."
                  : workspace.readinessSummary}
              </p>
            </div>
            <Pill tone={sessionStarted ? "success" : "warning"}>
              {sessionStarted ? "Live" : "Review"}
            </Pill>
          </div>

          <div className="dialysis-hero__meta">
            <span>{workspace.shiftLabel}</span>
            <span>{workspace.station}</span>
            <span>{workspace.chair}</span>
          </div>

          <div className="dialysis-hero__metrics">
            {heroMetrics.map(({ label, value, icon: Icon }) => (
              <div className="dialysis-hero__metric" key={label}>
                <span className="dialysis-hero__metric-icon">
                  <Icon size={15} />
                </span>
                <div>
                  <p>{label}</p>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <AnimatePresence mode="wait" initial={false}>
          {sessionStarted ? (
            <motion.div
              key="active-session"
              className="dialysis-stack"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={motionTokens.spring.soft}
            >
              <section className="dialysis-section-card">
                <div className="dialysis-section-card__header">
                  <div>
                    <p className="dialysis-section-card__eyebrow">Active monitoring</p>
                    <h2>Chairside overview</h2>
                  </div>
                  <div className="dialysis-section-card__header-icon">
                    <Activity size={16} />
                  </div>
                </div>
                <div className="dialysis-vitals-grid">
                  {workspace.liveVitals.map((vital) => (
                    <VitalCard key={vital.label} vital={vital} />
                  ))}
                </div>
              </section>

              <section className="dialysis-section-card">
                <div className="dialysis-section-card__header">
                  <div>
                    <p className="dialysis-section-card__eyebrow">Timeline</p>
                    <h2>Session checkpoints</h2>
                  </div>
                  <div className="dialysis-section-card__header-icon">
                    <Clock3 size={16} />
                  </div>
                </div>
                <div className="dialysis-timeline">
                  {workspace.timeline.map((event) => (
                    <article
                      className={clsx(
                        "dialysis-timeline__item",
                        `dialysis-timeline__item--${event.status}`
                      )}
                      key={event.id}
                    >
                      <div className="dialysis-timeline__rail">
                        <span />
                      </div>
                      <div className="dialysis-timeline__copy">
                        <div className="dialysis-timeline__top">
                          <strong>{event.title}</strong>
                          <span>{event.time}</span>
                        </div>
                        <p>{event.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="review-session"
              className="dialysis-stack"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={motionTokens.spring.soft}
            >
              <section className="dialysis-section-card">
                <div className="dialysis-section-card__header">
                  <div>
                    <p className="dialysis-section-card__eyebrow">Pre-start review</p>
                    <h2>Clinical readiness</h2>
                  </div>
                  <div className="dialysis-section-card__header-icon">
                    <CircleDot size={16} />
                  </div>
                </div>
                <div className="dialysis-readiness-grid">
                  {workspace.readinessItems.map((item) => (
                    <ReadinessCard key={item.id} item={item} />
                  ))}
                </div>
              </section>

              <section className="dialysis-section-card">
                <div className="dialysis-section-card__header">
                  <div>
                    <p className="dialysis-section-card__eyebrow">Pre dialysis vitals</p>
                    <h2>Start-critical values</h2>
                  </div>
                  <div className="dialysis-section-card__header-icon">
                    <Activity size={16} />
                  </div>
                </div>
                <div className="dialysis-vitals-grid">
                  {workspace.preVitals.map((vital) => (
                    <VitalCard key={vital.label} vital={vital} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="dialysis-section-card">
          <div className="dialysis-section-card__header">
            <div>
              <p className="dialysis-section-card__eyebrow">Prescription</p>
              <h2>Treatment orders</h2>
            </div>
            <button
              type="button"
              className="dialysis-inline-link"
              onClick={() => navigate("/prescriptions", { state: { patientId: patient.id } })}
            >
              Open Rx
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="dialysis-prescription-grid">
            {workspace.prescriptionFields.map((field) => (
              <PrescriptionFieldCard key={field.label} field={field} />
            ))}
          </div>
        </section>

        <section className="dialysis-inline-grid">
          <article className="dialysis-section-card">
            <div className="dialysis-section-card__header">
              <div>
                <p className="dialysis-section-card__eyebrow">Machine and team</p>
                <h2>Operational setup</h2>
              </div>
            </div>
            <div className="dialysis-detail-list">
              <div>
                <span>Machine</span>
                <strong>{workspace.machineNumber}</strong>
              </div>
              <div>
                <span>Started by</span>
                <strong>{workspace.startedBy}</strong>
              </div>
              <div>
                <span>Assisted by</span>
                <strong>{workspace.assistedBy}</strong>
              </div>
              <div>
                <span>Nephrologist</span>
                <strong>{workspace.nephrologist}</strong>
              </div>
            </div>
          </article>

          <article className="dialysis-section-card">
            <div className="dialysis-section-card__header">
              <div>
                <p className="dialysis-section-card__eyebrow">Context</p>
                <h2>Safety notes</h2>
              </div>
            </div>
            <div className="dialysis-note-list">
              {workspace.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
              <div className="dialysis-note-list__meta">
                <span>{workspace.serology}</span>
                <span>{workspace.anticoagulation}</span>
              </div>
            </div>
          </article>
        </section>

        <section className="dialysis-section-card">
          <div className="dialysis-section-card__header">
            <div>
              <p className="dialysis-section-card__eyebrow">Recent sessions</p>
              <h2>Recent dialysis tolerance</h2>
            </div>
          </div>
          <div className="dialysis-history-list">
            {workspace.recentSessions.map((session) => (
              <SessionHistoryCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      </div>

      <div className="dialysis-action-bar">
        <button
          type="button"
          className="dialysis-action-bar__secondary"
          onClick={() => navigate("/trends", { state: { patientId: patient.id } })}
        >
          View labs
        </button>
        <button
          type="button"
          className="dialysis-action-bar__primary"
          onClick={() => setSessionStarted((current) => !current)}
        >
          {sessionStarted ? "Session live" : "Confirm & start"}
        </button>
      </div>
    </motion.div>
  );
}
