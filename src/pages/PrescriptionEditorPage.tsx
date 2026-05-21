import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Copy,
  Download,
  Mic,
  MoreHorizontal,
  Printer,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import { prescriptions } from "../features/prescriptions/data";
import type { PrescriptionRecord } from "../features/prescriptions/types";

type RxStage = "capture" | "parsing" | "parsed";

type ParsedPrescription = {
  complaints: string;
  diagnosis: string;
  vitals: string;
  medications: string;
  investigations: string;
  advice: string;
  followUp: string;
};

const blankParsedPrescription: ParsedPrescription = {
  complaints: "",
  diagnosis: "",
  vitals: "",
  medications: "",
  investigations: "",
  advice: "",
  followUp: "",
};

const sampleFreeformDraft = [
  "Seen acc by family. Follow up visit. Mild pedal edema.",
  "Known renal transplant 2016, DM, HTN, COPD.",
  "BP 120/80, HR 72, temp 98.2 F.",
  "Tab doxycycline 100 mg 1-0-1 for 5 days.",
  "Tab wysolone 10 mg 1-0-0 morning.",
  "Tab pan 40 mg before food.",
  "KFT and CBC before next review.",
  "Review in 10 days.",
].join("\n");

function hasText(value: string) {
  return value.trim().length > 0;
}

function medicationToLine(medication: PrescriptionRecord["medications"][number]) {
  return [
    `${medication.form} ${medication.name} ${medication.strength}`.trim(),
    medication.frequency,
    medication.duration,
    medication.timing,
    medication.notes,
  ]
    .filter(hasText)
    .join(" · ");
}

function investigationToLine(investigation: PrescriptionRecord["investigations"][number]) {
  return [investigation.name, investigation.category, investigation.instructions]
    .filter(hasText)
    .join(" · ");
}

function parsedFromRecord(record?: PrescriptionRecord): ParsedPrescription {
  if (!record) return blankParsedPrescription;

  return {
    complaints: record.complaints,
    diagnosis: record.diagnosis,
    vitals: record.vitals.map((vital) => `${vital.label}: ${vital.value}`).join(", "),
    medications: record.medications.map(medicationToLine).join("\n"),
    investigations: record.investigations.map(investigationToLine).join("\n"),
    advice: record.advice,
    followUp: record.followUp,
  };
}

function parsePrototypeDraft(rawDraft: string): ParsedPrescription {
  const source = rawDraft.trim();

  if (!source) {
    return blankParsedPrescription;
  }

  return {
    complaints: "Seen accompanied by family. Follow-up visit with mild pedal edema and appetite variation.",
    diagnosis: "Renal transplant 2016 with diabetes, hypertension, COPD, and CKD follow-up.",
    vitals: "BP: 120/80 mmHg, HR: 72 bpm, Temp: 98.2 F",
    medications: [
      "Tab Doxycycline 100 mg · 1-0-1 · 5 days",
      "Tab Wysolone 10 mg · 1-0-0 · Morning",
      "Tab Pan 40 mg · 1-0-0 · Before food",
      "Tab Ondansetron 4 mg · SOS · For nausea/vomiting",
      "Tab Thyronorm 75 mcg · 1-0-0 · Before food",
    ].join("\n"),
    investigations: "KFT panel, CBC, serum potassium before next OPD review.",
    advice: "Continue salt restriction, monitor pedal edema, maintain medication adherence, and bring home BP log.",
    followUp: "Review in 10 days or earlier if breathlessness, weakness, or edema worsens.",
  };
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function ParsedSection({
  label,
  value,
  placeholder,
  rows = 3,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rx-ai-section">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
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

  const [stage, setStage] = useState<RxStage>(existingPrescription ? "parsed" : "capture");
  const [rawDraft, setRawDraft] = useState("");
  const [parsed, setParsed] = useState<ParsedPrescription>(() => parsedFromRecord(existingPrescription));
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  const pageTitle = existingPrescription ? "Prescription" : "New Rx";
  const recordMeta = useMemo(() => {
    return existingPrescription
      ? `${existingPrescription.department} · ${existingPrescription.createdAt}`
      : "Prescription";
  }, [existingPrescription]);
  const canParse = hasText(rawDraft);
  const isParsed = stage === "parsed";

  function handleParse() {
    if (!canParse || stage === "parsing") return;

    setStage("parsing");
    window.setTimeout(() => {
      setParsed(parsePrototypeDraft(rawDraft || sampleFreeformDraft));
      setStage("parsed");
    }, 1100);
  }

  function handleSaveDraft() {
    navigate("/prescriptions", { state: { patientId: patient.id } });
  }

  function handleFinalize() {
    setPrintPreviewOpen(false);
    navigate("/prescriptions", { state: { patientId: patient.id, savedPrescription: true } });
  }

  return (
    <motion.div
      className={`prescription-editor-page${printPreviewOpen ? " prescription-editor-page--preview-open" : ""}`}
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
            {isParsed ? "Parsed draft" : "Draft"}
          </Pill>
        </section>

        <section className="rx-ai-sheet">
          <div className="rx-ai-sheet__top">
            <div>
              <p className="rx-ai-sheet__title">{isParsed ? "RX" : "New RX"}</p>
              <p className="rx-ai-sheet__subtitle">
                {isParsed ? "Review and edit the parsed prescription." : "Type or dictate naturally. Jano will structure it."}
              </p>
            </div>
            <div className="rx-ai-sheet__tools">
              {isParsed ? (
                <button type="button" className="rx-ai-sheet__tool" aria-label="Copy parsed prescription">
                  <Copy size={17} />
                </button>
              ) : null}
              <button type="button" className="rx-ai-sheet__tool" aria-label="Dictate prescription">
                <Mic size={18} />
              </button>
            </div>
          </div>

          {stage === "capture" ? (
            <label className="rx-ai-capture">
              <span>Chief complaints & HPI:</span>
              <textarea
                value={rawDraft}
                onChange={(event) => setRawDraft(event.target.value)}
                placeholder="Type here..."
                rows={18}
                autoFocus
              />
            </label>
          ) : null}

          {stage === "parsing" ? (
            <div className="rx-ai-loader" aria-live="polite">
              <p className="rx-ai-loader__label">Structuring prescription</p>
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="rx-ai-loader__block" key={index}>
                  <span />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          ) : null}

          {stage === "parsed" ? (
            <div className="rx-ai-parsed">
              <ParsedSection
                label="Chief complaints & HPI:"
                value={parsed.complaints}
                placeholder="Add complaints and visit context"
                onChange={(value) => setParsed((current) => ({ ...current, complaints: value }))}
              />
              <ParsedSection
                label="Diagnosis:"
                value={parsed.diagnosis}
                placeholder="Add diagnosis"
                onChange={(value) => setParsed((current) => ({ ...current, diagnosis: value }))}
              />
              <ParsedSection
                label="Vitals:"
                value={parsed.vitals}
                placeholder="Add vitals"
                rows={2}
                onChange={(value) => setParsed((current) => ({ ...current, vitals: value }))}
              />
              <ParsedSection
                label="Medications:"
                value={parsed.medications}
                placeholder="Add medications"
                rows={7}
                onChange={(value) => setParsed((current) => ({ ...current, medications: value }))}
              />
              <ParsedSection
                label="Investigations:"
                value={parsed.investigations}
                placeholder="Type here..."
                rows={2}
                onChange={(value) => setParsed((current) => ({ ...current, investigations: value }))}
              />
              <ParsedSection
                label="Plan & Advice:"
                value={parsed.advice}
                placeholder="Type here..."
                rows={3}
                onChange={(value) => setParsed((current) => ({ ...current, advice: value }))}
              />
              <ParsedSection
                label="Follow Up:"
                value={parsed.followUp}
                placeholder="Type here..."
                rows={2}
                onChange={(value) => setParsed((current) => ({ ...current, followUp: value }))}
              />
            </div>
          ) : null}
        </section>
      </div>

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
                  className="prescription-print-preview__button prescription-print-preview__button--icon"
                  aria-label="Close print preview"
                  onClick={() => setPrintPreviewOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="prescription-print-preview__canvas">
              <article className="prescription-print-sheet">
                <header className="prescription-print-sheet__header">
                  <div className="prescription-print-sheet__brand">
                    <span className="prescription-print-sheet__crest">Rx</span>
                    <div>
                      <h3>{existingPrescription?.doctor ?? "Dr. Mehta"}</h3>
                      <p>Consultant Nephrologist</p>
                      <p>City General Hospital · Registration no. CGH-4832</p>
                    </div>
                  </div>
                  <div className="prescription-print-sheet__meta">
                    <div>
                      <p>Date</p>
                      <span>{existingPrescription?.createdAt ?? "Today"}</span>
                    </div>
                    <div>
                      <p>Department</p>
                      <span>{existingPrescription?.department ?? "OPD"}</span>
                    </div>
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
                    {hasText(parsed.complaints) ? parsed.complaints : "Not documented."}
                  </p>
                </section>

                <section className="prescription-print-sheet__section">
                  <p className="prescription-print-sheet__label">Diagnosis</p>
                  <p className="prescription-print-sheet__body">
                    {hasText(parsed.diagnosis) ? parsed.diagnosis : "Not documented."}
                  </p>
                </section>

                {hasText(parsed.vitals) ? (
                  <section className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Vitals</p>
                    <p className="prescription-print-sheet__body">{parsed.vitals}</p>
                  </section>
                ) : null}

                {hasText(parsed.medications) ? (
                  <section className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Medications</p>
                    <div className="prescription-print-sheet__simple-list">
                      {lines(parsed.medications).map((line, index) => (
                        <p key={`${line}-${index}`}>
                          <span>{index + 1}.</span>
                          {line}
                        </p>
                      ))}
                    </div>
                  </section>
                ) : null}

                {hasText(parsed.investigations) ? (
                  <section className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Investigations</p>
                    <div className="prescription-print-sheet__simple-list">
                      {lines(parsed.investigations).map((line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="prescription-print-sheet__footer-grid">
                  <div className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Plan & advice</p>
                    <p className="prescription-print-sheet__body">
                      {hasText(parsed.advice) ? parsed.advice : "No additional advice documented."}
                    </p>
                  </div>
                  <div className="prescription-print-sheet__section">
                    <p className="prescription-print-sheet__label">Follow-up</p>
                    <p className="prescription-print-sheet__body">
                      {hasText(parsed.followUp) ? parsed.followUp : "Follow-up timing not documented."}
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
            <div className="prescription-print-preview__footer-actions">
              <button
                type="button"
                className="prescription-print-preview__button prescription-print-preview__button--secondary"
                onClick={() => window.print()}
              >
                <Download size={15} />
                Print
              </button>
              <button
                type="button"
                className="prescription-print-preview__button prescription-print-preview__button--primary"
                onClick={handleFinalize}
              >
                <Check size={15} />
                Finalize
              </button>
            </div>
          </motion.section>
        </>
      ) : null}

      <div className="prescription-editor__actions">
        <button type="button" className="prescription-editor__secondary" onClick={handleSaveDraft}>
          Save draft
        </button>
        {isParsed ? (
          <button
            type="button"
            className="prescription-editor__primary"
            onClick={() => setPrintPreviewOpen(true)}
          >
            <Printer size={16} />
            Preview prescription
          </button>
        ) : (
          <button
            type="button"
            className="prescription-editor__primary"
            disabled={!canParse || stage === "parsing"}
            onClick={handleParse}
          >
            Save & Parse Data
            {stage === "parsing" ? null : <Check size={16} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
