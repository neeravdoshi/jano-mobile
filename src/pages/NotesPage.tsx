import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ClipboardList,
  FilePenLine,
  FileText,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import { patientProfiles } from "../fixtures/patientProfiles";
import { clinicalNotes, noteTypeLabels } from "../features/notes/data";
import type { ClinicalNote, NoteType } from "../features/notes/types";
import { medications } from "../features/medications/data";

type NoteFilter = "all" | NoteType | "drafts";

const filterLabels: Record<NoteFilter, string> = {
  all: "All",
  progress: "Progress notes",
  assessment: "Initial assessment",
  discharge: "Discharge summary",
  drafts: "Drafts",
};

const createOptions: Array<{ type: NoteType; label: string; icon: typeof FileText }> = [
  { type: "progress", label: "Progress note", icon: FilePenLine },
  { type: "assessment", label: "Initial assessment", icon: Stethoscope },
  { type: "discharge", label: "Discharge summary", icon: ClipboardList },
];

function getNoteTone(note: ClinicalNote) {
  if (note.status === "draft") return "warning";

  switch (note.type) {
    case "progress":
      return "neutral";
    case "assessment":
      return "danger";
    case "discharge":
      return "success";
  }
}

function NoteCard({ note, onOpen }: { note: ClinicalNote; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.soft}
      className={clsx("note-card", `note-card--${note.type}`, note.status === "draft" && "note-card--draft")}
      onClick={onOpen}
    >
      <div className="note-card__meta-row">
        <Pill tone={getNoteTone(note)}>{note.status === "draft" ? "Draft" : noteTypeLabels[note.type]}</Pill>
        <span className="note-card__time">{note.timestamp}</span>
      </div>
      <div className="note-card__copy">
        <h2 className="note-card__title">{note.title}</h2>
        <p className="note-card__summary">{note.summary}</p>
      </div>
      {note.highlights?.length ? (
        <ul className="note-card__highlights">
          {note.highlights.slice(0, 2).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <div className="note-card__footer">
        <span>{note.author}</span>
        <span>{note.specialty}</span>
      </div>
    </motion.button>
  );
}

export function NotesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];

  const [activeFilter, setActiveFilter] = useState<NoteFilter>("all");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profile = patientProfiles[patient.id];
  const portalTarget = useRef<Element | null>(null);

  useEffect(() => {
    portalTarget.current = document.querySelector(".mobile-frame__screen");
    const scroller = document.querySelector<HTMLElement>(".screen-content");
    if (scroller) scroller.style.overflow = profileOpen ? "hidden" : "";
    return () => { if (scroller) scroller.style.overflow = ""; };
  }, [profileOpen]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return clinicalNotes.filter((note) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "drafts" ? note.status === "draft" : note.type === activeFilter);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          note.title,
          note.summary,
          note.author,
          note.specialty,
          noteTypeLabels[note.type],
          ...note.sections.flatMap((section) => [section.label, section.value]),
          ...(note.highlights ?? []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const groupedNotes = useMemo(() => {
    const groups: Array<{ label: string; notes: ClinicalNote[] }> = [];

    for (const note of filteredNotes) {
      const existing = groups.find((group) => group.label === note.groupLabel);

      if (existing) {
        existing.notes.push(note);
      } else {
        groups.push({ label: note.groupLabel, notes: [note] });
      }
    }

    return groups;
  }, [filteredNotes]);

  return (
    <motion.div
      className="notes-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">Notes</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
        <button
          className="subpage-header__action"
          type="button"
          aria-label="Patient profile"
          onClick={() => setProfileOpen(true)}
        >
          <UserRound size={16} />
        </button>
      </header>

      <div className="notes-body">
        <section className="notes-toolbar">
          <label className="notes-search">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
            />
          </label>
        </section>

        <section className="notes-filters" aria-label="Note filters">
          {(Object.keys(filterLabels) as NoteFilter[]).map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              className={clsx("notes-filters__chip", activeFilter === filterKey && "notes-filters__chip--active")}
              onClick={() => setActiveFilter(filterKey)}
            >
              {filterLabels[filterKey]}
            </button>
          ))}
        </section>

        <section className="notes-list-section">
          {groupedNotes.map((group) => (
            <div className="notes-group" key={group.label}>
              <div className="notes-group__header">
                <p className="notes-group__label">{group.label}</p>
                <span>{group.notes.length}</span>
              </div>
              <div className="notes-list">
                {group.notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onOpen={() => navigate(`/notes/${note.id}`, { state: { patientId: patient.id } })}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 ? (
            <div className="notes-empty">
              <p className="notes-empty__title">No notes match this view</p>
              <p className="notes-empty__body">Try another filter or search term.</p>
            </div>
          ) : null}
        </section>
      </div>

      <div className="notes-create-bar">
        <button type="button" className="floating-create-button" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={18} /> : <Plus size={18} />}
          <span>New note</span>
        </button>
      </div>

      {portalTarget.current && createPortal(
        <AnimatePresence>
        {profileOpen && profile ? (
          <motion.div
            className="patient-sheet-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="patient-sheet__scrim"
              onClick={() => setProfileOpen(false)}
              aria-label="Close patient profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="patient-sheet"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={motionTokens.spring.sheet}
            >
              <div className="patient-sheet__header">
                <div className="patient-sheet__avatar">
                  {patient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="patient-sheet__identity">
                  <strong className="patient-sheet__name">{patient.name}</strong>
                  <span className="patient-sheet__demo">
                    {patient.age} y · {patient.gender} · MRN {patient.id.toUpperCase()}
                  </span>
                </div>
                <span className="patient-sheet__blood-group">{profile.bloodGroup}</span>
                <button
                  type="button"
                  className="patient-sheet__close"
                  onClick={() => setProfileOpen(false)}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="patient-sheet__body">
                <div className="patient-sheet__dx-row">
                  <div className="patient-sheet__dx">
                    <span className="patient-sheet__dx-label">Diagnosis</span>
                    <strong className="patient-sheet__dx-value">{profile.diagnosis}</strong>
                  </div>
                  <div className="patient-sheet__dx">
                    <span className="patient-sheet__dx-label">Since</span>
                    <strong className="patient-sheet__dx-value">{profile.diagnosisSince}</strong>
                  </div>
                  <div className="patient-sheet__dx">
                    <span className="patient-sheet__dx-label">Regimen</span>
                    <strong className="patient-sheet__dx-value">{profile.regimen}</strong>
                  </div>
                  <div className="patient-sheet__dx">
                    <span className="patient-sheet__dx-label">Physician</span>
                    <strong className="patient-sheet__dx-value">{profile.primaryPhysician} · {profile.specialty}</strong>
                  </div>
                </div>

                <div className="patient-sheet__findings">
                  {profile.keyFindings.map((finding) => (
                    <span key={finding} className="patient-sheet__finding">{finding}</span>
                  ))}
                </div>

                <div className="patient-sheet__section">
                  <p className="patient-sheet__section-label">Clinical assessment</p>
                  <p className="patient-sheet__assessment">{profile.clinicalAssessment}</p>
                </div>

                <div className="patient-sheet__section">
                  <p className="patient-sheet__section-label">Medications</p>
                  <ul className="patient-sheet__med-list">
                    {medications.filter((m) => m.status !== "completed").map((med) => (
                      <li key={med.id} className={`patient-sheet__med-item patient-sheet__med-item--${med.status}`}>
                        <span className="patient-sheet__med-name">{med.name}</span>
                        <span className="patient-sheet__med-detail">{med.dosage} · {med.frequency}</span>
                        {med.status === "paused" && (
                          <span className="patient-sheet__med-badge">On hold</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="patient-sheet__footer">
                <span className="patient-sheet__footer-stat">
                  <strong>{profile.activeMedications}</strong> active medications
                </span>
                <span className="patient-sheet__footer-divider" />
                <span className="patient-sheet__footer-stat">
                  Last review <strong>{profile.lastReview}</strong>
                </span>
                <span className="patient-sheet__footer-divider" />
                <span className="patient-sheet__footer-stat patient-sheet__footer-stat--allergy">
                  Allergy <strong>{profile.allergies}</strong>
                </span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
        </AnimatePresence>,
        portalTarget.current
      )}

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="notes-sheet-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="notes-sheet__scrim"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="notes-sheet"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={motionTokens.spring.sheet}
            >
              {createOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.type}
                    type="button"
                    className="notes-sheet__option"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/notes/new?type=${option.type}`, { state: { patientId: patient.id } });
                    }}
                  >
                    <span className="notes-sheet__option-icon">
                      <Icon size={16} />
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
