import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Mic, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import {
  clinicalNotes,
  defaultSectionsByType,
  noteTypeEyebrows,
  noteTypeLabels,
} from "../features/notes/data";
import type { NoteSection, NoteType } from "../features/notes/types";

function isNoteType(value: string | null): value is NoteType {
  return value === "progress" || value === "assessment" || value === "discharge";
}

export function NoteEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { noteId } = useParams();
  const [searchParams] = useSearchParams();

  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];
  const existingNote = noteId ? clinicalNotes.find((note) => note.id === noteId) : undefined;
  const requestedType = searchParams.get("type");
  const initialType: NoteType = isNoteType(requestedType)
    ? requestedType
    : existingNote?.type ?? "progress";

  const [noteType, setNoteType] = useState<NoteType>(initialType);
  const [title, setTitle] = useState(existingNote?.title ?? `New ${noteTypeLabels[initialType]}`);
  const [sections, setSections] = useState<NoteSection[]>(
    existingNote?.sections ??
      defaultSectionsByType[initialType].map((section: NoteSection) => ({ ...section }))
  );

  const pageTitle = useMemo(() => {
    if (existingNote) return existingNote.title;
    return noteTypeLabels[noteType];
  }, [existingNote, noteType]);

  function handleTypeChange(nextType: NoteType) {
    setNoteType(nextType);

    if (!existingNote) {
      setTitle(`New ${noteTypeLabels[nextType]}`);
      setSections(defaultSectionsByType[nextType].map((section) => ({ ...section })));
    }
  }

  function updateSection(index: number, value: string) {
    setSections((current) =>
      current.map((section, currentIndex) =>
        currentIndex === index ? { ...section, value } : section
      )
    );
  }

  return (
    <motion.div
      className="note-editor-page"
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
          <p className="subpage-header__subtitle">Notes</p>
        </div>
        <button type="button" className="note-editor__menu" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </header>

      <div className="note-editor-body">
        <section className="note-editor__patient">
          <div>
            <p className="note-editor__patient-name">{patient.name}</p>
            <p className="note-editor__patient-meta">
              MRN {patient.id.toUpperCase()} · {patient.age}Y · {patient.gender}
            </p>
          </div>
          <Pill tone="neutral">{noteTypeEyebrows[noteType]}</Pill>
        </section>

        {!existingNote ? (
          <section className="note-editor__type-row">
            {(["progress", "assessment", "discharge"] as NoteType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={clsx("note-editor__type-chip", noteType === type && "note-editor__type-chip--active")}
                onClick={() => handleTypeChange(type)}
              >
                {noteTypeLabels[type]}
              </button>
            ))}
          </section>
        ) : null}

        <section className="note-editor__sheet">
          <div className="note-editor__title-row">
            <input
              className="note-editor__title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Note title"
            />
            <button type="button" className="note-editor__voice" aria-label="Dictate note">
              <Mic size={16} />
            </button>
          </div>

          <div className="note-editor__sections">
            {sections.map((section, index) => (
              <label className="note-editor__section" key={section.label}>
                <span className="note-editor__section-label">{section.label}</span>
                <textarea
                  value={section.value}
                  onChange={(event) => updateSection(index, event.target.value)}
                  rows={section.value.length > 120 ? 5 : 3}
                  placeholder={`Add ${section.label.toLowerCase()}`}
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="note-editor__actions">
        <button type="button" className="note-editor__secondary" onClick={() => navigate("/notes", { state: { patientId: patient.id } })}>
          Save draft
        </button>
        <button type="button" className="note-editor__primary" onClick={() => navigate("/notes", { state: { patientId: patient.id } })}>
          Save note
        </button>
      </div>
    </motion.div>
  );
}
