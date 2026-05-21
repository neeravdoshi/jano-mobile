import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  FileUp,
  Plus,
  Search,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import { prescriptions } from "../features/prescriptions/data";
import type { PrescriptionRecord, PrescriptionStatus } from "../features/prescriptions/types";

type PrescriptionFilter = "all" | PrescriptionStatus;

const filterLabels: Record<PrescriptionFilter, string> = {
  all: "All",
  draft: "Drafts",
  signed: "Signed",
};

function statusTone(status: PrescriptionStatus) {
  return status === "draft" ? "warning" : "neutral";
}

function statusLabel(status: PrescriptionStatus) {
  return status === "draft" ? "Draft" : "Signed";
}

function PrescriptionCard({
  record,
  onOpen,
}: {
  record: PrescriptionRecord;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.soft}
      className={clsx("rx-card", record.status === "draft" && "rx-card--draft")}
      onClick={onOpen}
    >
      <div className="rx-card__meta">
        <Pill tone={statusTone(record.status)}>{statusLabel(record.status)}</Pill>
        <span>{record.createdAt}</span>
      </div>
      <div className="rx-card__copy">
        <h2 className="rx-card__title">{record.title}</h2>
        <p className="rx-card__summary">{record.summary}</p>
      </div>
      <div className="rx-card__footer">
        <span>{record.department}</span>
        <span>{record.doctor}</span>
        <ChevronRight size={16} />
      </div>
    </motion.button>
  );
}

export function PrescriptionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];

  const [filter, setFilter] = useState<PrescriptionFilter>("all");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredPrescriptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return prescriptions.filter((record) => {
      const matchesFilter = filter === "all" || record.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          record.title,
          record.department,
          record.doctor,
          record.summary,
          record.diagnosis,
          ...record.medications.flatMap((medication) => [medication.name, medication.notes]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const groupedPrescriptions = useMemo(() => {
    const groups: Array<{ label: string; items: PrescriptionRecord[] }> = [];

    for (const record of filteredPrescriptions) {
      const existing = groups.find((group) => group.label === record.groupLabel);

      if (existing) {
        existing.items.push(record);
      } else {
        groups.push({ label: record.groupLabel, items: [record] });
      }
    }

    return groups;
  }, [filteredPrescriptions]);

  return (
    <motion.div
      className="prescriptions-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">Prescriptions</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
      </header>

      <div className="prescriptions-body">
        <section className="rx-toolbar">
          <label className="rx-search">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search prescriptions"
              aria-label="Search prescriptions"
            />
          </label>
        </section>

        <section className="rx-filters" aria-label="Prescription filters">
          {(Object.keys(filterLabels) as PrescriptionFilter[]).map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              className={clsx("rx-filters__chip", filter === filterKey && "rx-filters__chip--active")}
              onClick={() => setFilter(filterKey)}
            >
              {filterLabels[filterKey]}
            </button>
          ))}
        </section>

        <section className="rx-list-section">
          {groupedPrescriptions.map((group) => (
            <div className="rx-group" key={group.label}>
              <div className="rx-group__header">
                <p className="rx-group__label">{group.label}</p>
                <span>{group.items.length}</span>
              </div>
              <div className="rx-list">
                {group.items.map((record) => (
                  <PrescriptionCard
                    key={record.id}
                    record={record}
                    onOpen={() => navigate(`/prescriptions/${record.id}`, { state: { patientId: patient.id } })}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredPrescriptions.length === 0 ? (
            <div className="rx-empty">
              <p className="rx-empty__title">No prescriptions match this view</p>
              <p className="rx-empty__body">
                Try another search or filter to bring the patient’s prescription history back into view.
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <div className="rx-create-bar">
        <button
          type="button"
          className="floating-create-button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Plus size={18} />}
          New Rx
        </button>
      </div>

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
              aria-label="Close prescription actions"
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
              <button
                type="button"
                className="notes-sheet__option"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/prescriptions/new", { state: { patientId: patient.id, mode: "typed" } });
                }}
              >
                <span className="notes-sheet__option-icon">
                  <FilePenLine size={16} />
                </span>
                <span>Start typed prescription</span>
              </button>
              <button
                type="button"
                className="notes-sheet__option"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/prescriptions/upload", { state: { patientId: patient.id } });
                }}
              >
                <span className="notes-sheet__option-icon">
                  <FileUp size={16} />
                </span>
                <span>Upload prescription</span>
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
