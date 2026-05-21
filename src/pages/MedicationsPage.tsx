import { useDeferredValue, useMemo, useState, startTransition } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  Pill as PillIcon,
  Search,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import { medications } from "../features/medications/data";
import type { Medication, MedicationStatus } from "../features/medications/types";

type MedicationFilter = "all" | MedicationStatus;

const filterLabels: Record<MedicationFilter, string> = {
  all: "All",
  ongoing: "Ongoing",
  paused: "Paused",
  completed: "Completed"
};

function formatStatusLabel(status: MedicationStatus) {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "paused":
      return "Paused";
    case "completed":
      return "Completed";
  }
}

function formatStatusTone(status: MedicationStatus) {
  switch (status) {
    case "ongoing":
      return "success";
    case "paused":
      return "warning";
    case "completed":
      return "neutral";
  }
}

function MedicationCard({ medication }: { medication: Medication }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.soft}
      className={clsx("med-card", `med-card--${medication.tone}`)}
    >
      <div className="med-card__header">
        <div className={clsx("med-card__tile", `med-card__tile--${medication.tone}`)}>
          <PillIcon size={18} />
        </div>
        <div className="med-card__copy">
          <div className="med-card__topline">
            <Pill tone={formatStatusTone(medication.status)}>
              {formatStatusLabel(medication.status)}
            </Pill>
            <span className="med-card__updated">{medication.lastUpdated}</span>
          </div>
          <h2 className="med-card__name">{medication.name}</h2>
          <p className="med-card__brand">
            {medication.brand} · {medication.classCode}
          </p>
        </div>
      </div>

      <div className="med-card__meta-row">
        <span>{medication.form}</span>
        <span>{medication.dosage}</span>
        <span>{medication.frequency}</span>
      </div>

      <p className="med-card__indication">{medication.indication}</p>

      <div className="med-card__footer">
        <span>{medication.prescribedBy} · {medication.specialty}</span>
        <span>Review {medication.reviewDate}</span>
      </div>
    </motion.article>
  );
}

export function MedicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MedicationFilter>("all");
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => {
    const base = {
      all: medications.length,
      ongoing: 0,
      paused: 0,
      completed: 0
    };

    for (const medication of medications) {
      base[medication.status] += 1;
    }

    return base;
  }, []);

  const filteredMeds = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return medications.filter((medication) => {
      const matchesFilter = activeFilter === "all" || medication.status === activeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [medication.name, medication.brand, medication.classCode, medication.specialty]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, deferredQuery]);

  const highlightedMedication = medications.find((medication) => medication.id === "med-glargine");

  return (
    <motion.div
      className="medications-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">Medications</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
      </header>

      <div className="meds-body">
        <section className="meds-cta-card">
          <p className="meds-cta-card__copy">
            To add or update medications, use the prescription workflow.
          </p>
          <button
            type="button"
            className="meds-cta-card__action"
            onClick={() => navigate("/prescriptions", { state: { patientId: patient.id } })}
          >
            Open prescriptions
            <ArrowUpRight size={16} />
          </button>
        </section>

        <section className="meds-hero-card">
          <div className="meds-hero-card__header">
            <div>
              <p className="eyebrow">Current regimen</p>
              <h2 className="meds-hero-card__title">Medication review</h2>
            </div>
            <span className="meds-hero-card__signal">2 recent changes</span>
          </div>
          <div className="meds-hero-card__metrics">
            <div>
              <strong>{counts.ongoing}</strong>
              <span>Ongoing</span>
            </div>
            <div>
              <strong>{counts.paused}</strong>
              <span>Paused</span>
            </div>
            <div>
              <strong>{counts.completed}</strong>
              <span>Stopped</span>
            </div>
          </div>
          {highlightedMedication ? (
            <div className="meds-hero-card__review ai-suggestion">
              <div className="ai-suggestion__copy">
                <div className="ai-suggestion__tag-row">
                  <span className="ai-suggestion__label">
                    <span className="ai-suggestion__icon" aria-hidden="true">
                      <Sparkles size={12} />
                    </span>
                    AI suggestion
                  </span>
                </div>
                <p>
                  Review {highlightedMedication.name} against recent fasting sugar and dialysis
                  follow-up.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="meds-toolbar">
          <label className="meds-search">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search medication or brand"
              aria-label="Search medications"
            />
          </label>
        </section>

        <section className="meds-segmented" aria-label="Medication status filters">
          {(Object.keys(filterLabels) as MedicationFilter[]).map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              className={clsx(
                "meds-segmented__chip",
                activeFilter === filterKey && "meds-segmented__chip--active"
              )}
              onClick={() => {
                startTransition(() => {
                  setActiveFilter(filterKey);
                });
              }}
            >
              <span>{filterLabels[filterKey]}</span>
              <strong>{counts[filterKey]}</strong>
            </button>
          ))}
        </section>

        <section className="meds-list-section">
          <div className="meds-list-section__header">
            <h2 className="meds-list-section__title">
              {activeFilter === "all" ? "All medications" : `${filterLabels[activeFilter]} medications`}
            </h2>
            <span className="meds-list-section__count">{filteredMeds.length}</span>
          </div>

          <div className="meds-list">
            {filteredMeds.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>

          {filteredMeds.length === 0 ? (
            <div className="meds-empty">
              <p className="meds-empty__title">No medications match this view</p>
              <p className="meds-empty__body">
                Try another filter or search term to bring the patient’s prescription history back
                into view.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </motion.div>
  );
}
