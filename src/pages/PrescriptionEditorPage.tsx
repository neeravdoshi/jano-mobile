import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  Download,
  Mic,
  MoreHorizontal,
  Plus,
  Printer,
  Trash2,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import { prescriptions } from "../features/prescriptions/data";
import type {
  PrescriptionInvestigation,
  PrescriptionMedication,
} from "../features/prescriptions/types";

function cloneMedication(medication: PrescriptionMedication): PrescriptionMedication {
  return { ...medication };
}

function cloneInvestigation(investigation: PrescriptionInvestigation): PrescriptionInvestigation {
  return { ...investigation };
}

function hasText(value: string) {
  return value.trim().length > 0;
}

export function PrescriptionEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prescriptionId } = useParams();
  const state = location.state as { patientId?: string; mode?: "typed" | "dictation" } | null;

  const patientId = state?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];
  const existingPrescription = prescriptionId
    ? prescriptions.find((record) => record.id === prescriptionId)
    : undefined;

  const [title, setTitle] = useState(existingPrescription?.title ?? "New Rx");
  const [complaints, setComplaints] = useState(existingPrescription?.complaints ?? "");
  const [diagnosis, setDiagnosis] = useState(existingPrescription?.diagnosis ?? "");
  const [advice, setAdvice] = useState(existingPrescription?.advice ?? "");
  const [followUp, setFollowUp] = useState(existingPrescription?.followUp ?? "");
  const [medications, setMedications] = useState<PrescriptionMedication[]>(
    existingPrescription?.medications.map(cloneMedication) ?? [
      {
        id: "draft-med-1",
        name: "",
        form: "Tab",
        strength: "",
        frequency: "1-0-1",
        duration: "5 days",
        timing: "After food",
        notes: "",
      },
    ]
  );
  const [investigations, setInvestigations] = useState<PrescriptionInvestigation[]>(
    existingPrescription?.investigations.map(cloneInvestigation) ?? []
  );
  const [dictationOpen, setDictationOpen] = useState(state?.mode === "dictation");
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  const pageTitle = existingPrescription ? "Prescription" : "New Rx";
  const recordMeta = useMemo(() => {
    return existingPrescription
      ? `${existingPrescription.department} · ${existingPrescription.createdAt}`
      : "Prescription";
  }, [existingPrescription]);
  const previewMedications = useMemo(
    () => medications.filter((item) => hasText(item.name)),
    [medications]
  );
  const previewInvestigations = useMemo(
    () => investigations.filter((item) => hasText(item.name)),
    [investigations]
  );

  function openPrintPreview() {
    setPrintPreviewOpen(true);
  }

  function updateMedication(id: string, key: keyof PrescriptionMedication, value: string) {
    setMedications((current) =>
      current.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }

  function addMedication() {
    setMedications((current) => [
      ...current,
      {
        id: `draft-med-${current.length + 1}`,
        name: "",
        form: "Tab",
        strength: "",
        frequency: "1-0-1",
        duration: "5 days",
        timing: "After food",
        notes: "",
      },
    ]);
  }

  function removeMedication(id: string) {
    setMedications((current) => current.filter((item) => item.id !== id));
  }

  function updateInvestigation(id: string, key: keyof PrescriptionInvestigation, value: string) {
    setInvestigations((current) =>
      current.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }

  function addInvestigation() {
    setInvestigations((current) => [
      ...current,
      {
        id: `draft-investigation-${current.length + 1}`,
        name: "",
        category: "",
        instructions: "",
      },
    ]);
  }

  function removeInvestigation(id: string) {
    setInvestigations((current) => current.filter((item) => item.id !== id));
  }

  return (
    <motion.div
      className="prescription-editor-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">{pageTitle}</h1>
          <p className="subpage-header__subtitle">{recordMeta}</p>
        </div>
        <button type="button" className="note-editor__menu" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </header>

      <div className="prescription-editor-body">
        <section className="prescription-editor__patient">
          <div>
            <p className="prescription-editor__patient-name">{patient.name}</p>
            <p className="prescription-editor__patient-meta">
              MRN {patient.id.toUpperCase()} · {patient.age}Y · {patient.gender}
            </p>
          </div>
          <Pill tone={existingPrescription?.status === "signed" ? "neutral" : "warning"}>
            {existingPrescription?.status === "signed" ? "Signed" : "Draft"}
          </Pill>
        </section>

        <section className="prescription-editor__sheet">
          <div className="prescription-editor__title-row">
            <input
              className="prescription-editor__title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Prescription title"
            />
            <button type="button" className="prescription-editor__voice" aria-label="Dictate prescription" onClick={() => setDictationOpen((current) => !current)}>
              <Mic size={16} />
            </button>
          </div>

          <label className="prescription-editor__field">
            <span>Chief complaints & HPI</span>
            <textarea
              value={complaints}
              onChange={(event) => setComplaints(event.target.value)}
              placeholder="Type symptoms, timeline, and visit context"
              rows={4}
            />
          </label>

          <label className="prescription-editor__field">
            <span>Diagnosis</span>
            <textarea
              value={diagnosis}
              onChange={(event) => setDiagnosis(event.target.value)}
              placeholder="Working diagnosis"
              rows={3}
            />
          </label>

          <section className="prescription-editor__block">
            <div className="prescription-editor__block-header">
              <h2>Medications</h2>
              <button type="button" className="prescription-editor__inline-action" onClick={addMedication}>
                <Plus size={14} />
                Add
              </button>
            </div>
            <div className="prescription-editor__medications">
              {medications.map((medication, index) => (
                <article className="prescription-editor__med-card" key={medication.id}>
                  <div className="prescription-editor__med-card-header">
                    <p>Med {index + 1}</p>
                    {medications.length > 1 ? (
                      <button
                        type="button"
                        className="prescription-editor__icon-action"
                        aria-label={`Remove medication ${index + 1}`}
                        onClick={() => removeMedication(medication.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>
                  <div className="prescription-editor__grid prescription-editor__grid--med">
                    <label>
                      <span>Name</span>
                      <input
                        value={medication.name}
                        onChange={(event) => updateMedication(medication.id, "name", event.target.value)}
                        placeholder="Medication name"
                      />
                    </label>
                    <label>
                      <span>Form</span>
                      <input
                        value={medication.form}
                        onChange={(event) => updateMedication(medication.id, "form", event.target.value)}
                        placeholder="Tab"
                      />
                    </label>
                    <label>
                      <span>Strength</span>
                      <input
                        value={medication.strength}
                        onChange={(event) => updateMedication(medication.id, "strength", event.target.value)}
                        placeholder="500 mg"
                      />
                    </label>
                    <label>
                      <span>Frequency</span>
                      <input
                        value={medication.frequency}
                        onChange={(event) => updateMedication(medication.id, "frequency", event.target.value)}
                        placeholder="1-0-1"
                      />
                    </label>
                    <label>
                      <span>Duration</span>
                      <input
                        value={medication.duration}
                        onChange={(event) => updateMedication(medication.id, "duration", event.target.value)}
                        placeholder="5 days"
                      />
                    </label>
                    <label>
                      <span>Timing</span>
                      <input
                        value={medication.timing}
                        onChange={(event) => updateMedication(medication.id, "timing", event.target.value)}
                        placeholder="After food"
                      />
                    </label>
                  </div>
                  <label className="prescription-editor__subfield">
                    <span>Notes</span>
                    <input
                      value={medication.notes}
                      onChange={(event) => updateMedication(medication.id, "notes", event.target.value)}
                      placeholder="Additional medication instructions"
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>

          <section className="prescription-editor__block">
            <div className="prescription-editor__block-header">
              <h2>Investigations</h2>
              <button type="button" className="prescription-editor__inline-action" onClick={addInvestigation}>
                <Plus size={14} />
                Add
              </button>
            </div>
            <div className="prescription-editor__investigations">
              {investigations.length === 0 ? (
                <p className="prescription-editor__empty">No investigations added yet.</p>
              ) : (
                investigations.map((investigation, index) => (
                  <article className="prescription-editor__investigation-card" key={investigation.id}>
                    <div className="prescription-editor__med-card-header">
                      <p>Investigation {index + 1}</p>
                      <button
                        type="button"
                        className="prescription-editor__icon-action"
                        aria-label={`Remove investigation ${index + 1}`}
                        onClick={() => removeInvestigation(investigation.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="prescription-editor__grid">
                      <label>
                        <span>Name</span>
                        <input
                          value={investigation.name}
                          onChange={(event) => updateInvestigation(investigation.id, "name", event.target.value)}
                          placeholder="CBC"
                        />
                      </label>
                      <label>
                        <span>Category</span>
                        <input
                          value={investigation.category}
                          onChange={(event) => updateInvestigation(investigation.id, "category", event.target.value)}
                          placeholder="Blood tests"
                        />
                      </label>
                    </div>
                    <label className="prescription-editor__subfield">
                      <span>Instructions</span>
                      <input
                        value={investigation.instructions}
                        onChange={(event) => updateInvestigation(investigation.id, "instructions", event.target.value)}
                        placeholder="Repeat before next dialysis session"
                      />
                    </label>
                  </article>
                ))
              )}
            </div>
          </section>

          <label className="prescription-editor__field">
            <span>Plan & advice</span>
            <textarea
              value={advice}
              onChange={(event) => setAdvice(event.target.value)}
              placeholder="Diet, precautions, medication counselling"
              rows={3}
            />
          </label>

          <label className="prescription-editor__field">
            <span>Follow-up</span>
            <textarea
              value={followUp}
              onChange={(event) => setFollowUp(event.target.value)}
              placeholder="Review after 7 days"
              rows={2}
            />
          </label>
        </section>
      </div>

      {dictationOpen ? (
        <motion.div
          className="prescription-editor__dictation"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTokens.spring.soft}
        >
          <div className="prescription-editor__dictation-top">
            <div>
              <p className="prescription-editor__dictation-label">Dictating Rx</p>
              <p className="prescription-editor__dictation-copy">
                Voice draft is being structured into clinical sections quietly in the background.
              </p>
            </div>
            <button type="button" className="prescription-editor__icon-action" onClick={() => setDictationOpen(false)}>
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="prescription-editor__waveform" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="prescription-editor__dictation-transcript">
            {existingPrescription?.dictationPrompt ??
              "Patient with CKD on maintenance hemodialysis. Review complaints, update medications, order investigations, and advise follow-up."}
          </div>
        </motion.div>
      ) : null}

      {printPreviewOpen ? (
        <>
          <motion.button
            type="button"
            className="prescription-print-preview__scrim"
            aria-label="Close print preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPrintPreviewOpen(false)}
          />
          <motion.section
            className="prescription-print-preview"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTokens.spring.soft}
          >
            <div className="prescription-print-preview__topbar">
              <h2 className="prescription-print-preview__title">Prescription preview</h2>
              <div className="prescription-print-preview__actions">
                <button
                  type="button"
                  className="prescription-print-preview__button prescription-print-preview__button--primary"
                  onClick={() => window.print()}
                >
                  <Download size={15} />
                  Print
                </button>
                <button
                  type="button"
                  className="prescription-print-preview__button prescription-print-preview__button--icon"
                  aria-label="Close print preview"
                  onClick={() => setPrintPreviewOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="prescription-print-preview__canvas">
              <span className="prescription-print-preview__page-count">1 of 1</span>
              <article className="prescription-print-sheet">
                <header className="prescription-print-sheet__header">
                  <div className="prescription-print-sheet__brand">
                    <span className="prescription-print-sheet__crest">Rx</span>
                    <div>
                      <h3>Dr. {existingPrescription?.doctor ?? "Mehta"}</h3>
                      <p>Consultant Nephrologist</p>
                      <p>City General Hospital · Registration no. CGH-4832</p>
                    </div>
                  </div>
                  <div className="prescription-print-sheet__meta">
                    <span>
                      <CalendarDays size={14} />
                      {existingPrescription?.createdAt ?? "Today"}
                    </span>
                    <span>
                      <ClipboardList size={14} />
                      {existingPrescription?.department ?? "Outpatient consultation"}
                    </span>
                  </div>
                </header>

                <section className="prescription-print-sheet__patient">
                  <div>
                    <p>Patient</p>
                    <strong>{patient.name}</strong>
                  </div>
                  <div>
                    <p>MRN</p>
                    <strong>{patient.id.toUpperCase()}</strong>
                  </div>
                  <div>
                    <p>Age / Sex</p>
                    <strong>
                      {patient.age}Y / {patient.gender}
                    </strong>
                  </div>
                </section>

                <section className="prescription-print-sheet__section">
                  <p className="prescription-print-sheet__label">Chief complaints & HPI</p>
                  <p className="prescription-print-sheet__body">
                    {hasText(complaints) ? complaints : "Not documented."}
                  </p>
                </section>

                <section className="prescription-print-sheet__section">
                  <p className="prescription-print-sheet__label">Diagnosis</p>
                  <p className="prescription-print-sheet__body">
                    {hasText(diagnosis) ? diagnosis : "Not documented."}
                  </p>
                </section>

                {previewMedications.length > 0 ? (
                  <section className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Medications</p>
                    <div className="prescription-print-sheet__medications">
                      {previewMedications.map((medication, index) => (
                        <article className="prescription-print-sheet__medication" key={medication.id}>
                          <div className="prescription-print-sheet__medication-top">
                            <strong>
                              {index + 1}. {medication.name}
                            </strong>
                            <span>
                              {medication.form} {medication.strength}
                            </span>
                          </div>
                          <p>
                            {medication.frequency} · {medication.duration} · {medication.timing}
                          </p>
                          {hasText(medication.notes) ? (
                            <p className="prescription-print-sheet__hint">{medication.notes}</p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                {previewInvestigations.length > 0 ? (
                  <section className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Investigations</p>
                    <div className="prescription-print-sheet__list">
                      {previewInvestigations.map((investigation) => (
                        <div className="prescription-print-sheet__list-row" key={investigation.id}>
                          <strong>{investigation.name}</strong>
                          <span>
                            {investigation.category}
                            {hasText(investigation.instructions) ? ` · ${investigation.instructions}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="prescription-print-sheet__footer-grid">
                  <div className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Plan & advice</p>
                    <p className="prescription-print-sheet__body">
                      {hasText(advice) ? advice : "No additional advice documented."}
                    </p>
                  </div>
                  <div className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Follow-up</p>
                    <p className="prescription-print-sheet__body">
                      {hasText(followUp) ? followUp : "Follow-up timing not documented."}
                    </p>
                  </div>
                </section>

                <footer className="prescription-print-sheet__signature">
                  <div>
                    <p>Generated by Jano</p>
                    <span>Page 1 of 1</span>
                  </div>
                  <div>
                    <strong>{existingPrescription?.doctor ?? "Dr. Mehta"}</strong>
                    <p>Consultant signature</p>
                  </div>
                </footer>
              </article>
            </div>
          </motion.section>
        </>
      ) : null}

      <div className="prescription-editor__actions">
        <button type="button" className="prescription-editor__secondary" onClick={() => navigate("/prescriptions", { state: { patientId: patient.id } })}>
          Save draft
        </button>
        {existingPrescription?.status === "signed" ? (
          <button type="button" className="prescription-editor__primary" onClick={openPrintPreview}>
            <Printer size={16} />
            Print
          </button>
        ) : (
          <button type="button" className="prescription-editor__primary" onClick={() => navigate("/prescriptions", { state: { patientId: patient.id } })}>
            Save & review
          </button>
        )}
      </div>
    </motion.div>
  );
}
