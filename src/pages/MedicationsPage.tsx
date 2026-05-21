import { useDeferredValue, useMemo, useState, startTransition } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Pill as PillIcon,
  Search,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { motionTokens } from "../design-system/motion";

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

function PillsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g opacity="0.4">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.28662 9.40614C5.46416 9.18799 5.78665 9.15916 6.00007 9.34236L11.171 13.7808C11.3767 13.9574 11.4043 14.2656 11.2332 14.4758L9.40061 16.7281C8.74061 17.5381 7.81061 18.0481 6.77061 18.1481C6.64061 18.1581 6.51061 18.1681 6.38061 18.1681C5.49061 18.1681 4.62061 17.8581 3.92061 17.2681C2.26061 15.8981 2.02061 13.4281 3.38061 11.7481L5.28662 9.40614Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.7307 10.1881L12.8056 12.5495C12.6277 12.7678 12.3046 12.7961 12.0914 12.612L6.92848 8.15555C6.72366 7.97876 6.69664 7.67111 6.86749 7.46132L8.71067 5.19807C9.38067 4.38807 10.3107 3.88807 11.3507 3.78807C12.3807 3.69807 13.4007 3.99807 14.2007 4.66807C15.8607 6.03807 16.1007 8.50807 14.7307 10.1881Z" fill="currentColor" />
      </g>
      <path fillRule="evenodd" clipRule="evenodd" d="M19.3029 12.2355C19.5669 12.3832 19.5914 12.739 19.3784 12.9538L14.2894 18.086C14.0742 18.3029 13.7142 18.2782 13.5665 18.0107C13.2304 17.4016 13.0408 16.7031 13.0408 15.968C13.0408 13.618 14.9408 11.708 17.2708 11.708C18.0071 11.708 18.7006 11.8982 19.3029 12.2355Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M21.5008 15.9681C21.5008 18.3181 19.6008 20.2281 17.2708 20.2281C16.6342 20.2281 16.0312 20.0878 15.4912 19.8283C15.2094 19.6929 15.1742 19.3233 15.3946 19.1014L20.3765 14.0854C20.6003 13.86 20.9766 13.8981 21.1101 14.1863C21.3623 14.7305 21.5008 15.3354 21.5008 15.9681Z" fill="currentColor" />
    </svg>
  );
}

function PillsBoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M17.5101 8.81695L15.9101 7.26695C15.8101 7.17695 15.6901 7.12695 15.5601 7.12695H8.44007C8.31007 7.12695 8.18007 7.17695 8.09007 7.26695L6.49007 8.81695C5.89007 9.39695 5.57007 10.177 5.57007 10.997V18.777C5.57007 20.457 6.93007 21.817 8.60007 21.817H15.4001C17.0701 21.817 18.4301 20.457 18.4301 18.777V10.997C18.4301 10.177 18.1001 9.39695 17.5101 8.81695Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.61108 6.13359H15.3881C15.6651 6.13359 15.8881 5.90959 15.8881 5.63359V3.74859C15.8881 2.88559 15.1851 2.18359 14.3201 2.18359H9.67808C8.81408 2.18359 8.11108 2.88559 8.11108 3.74859V5.63359C8.11108 5.90959 8.33508 6.13359 8.61108 6.13359Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.38029 17.1272C8.92029 17.1272 8.55029 16.7572 8.55029 16.2972V14.1872C8.55029 13.7272 8.92029 13.3572 9.38029 13.3572H14.6203C15.0703 13.3572 15.4503 13.7272 15.4503 14.1872V16.2972C15.4503 16.7572 15.0703 17.1272 14.6103 17.1272H9.38029Z" fill="currentColor" />
    </svg>
  );
}

function SyringeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M13.74 17.8384L13.39 18.1884C12.38 19.1984 11.04 19.7584 9.6 19.7584C8.42 19.7584 7.3 19.3784 6.38 18.6784C6.18 18.5284 5.99 18.3684 5.81 18.1884C5.63 18.0084 5.47 17.8184 5.32 17.6184C4.62 16.6984 4.25 15.5784 4.25 14.3984C4.25 12.9684 4.8 11.6184 5.81 10.6084L10.57 5.85836C11.23 5.18836 12.05 4.81836 12.87 4.81836H12.88C13.66 4.81836 14.4 5.13836 15.02 5.75836L18.24 8.97836C19.54 10.2784 19.5 12.0684 18.15 13.4384L17.43 14.1584L13.74 17.8384Z" fill="currentColor" />
      <path d="M19.6899 4.31848L21.5299 6.14848C21.8199 6.43848 21.8199 6.91848 21.5299 7.20848C21.3799 7.35848 21.1899 7.42848 20.9999 7.42848C20.8099 7.42848 20.6199 7.35848 20.4699 7.20848L19.1599 5.89848L17.1599 7.89848L16.0999 6.83848L18.0999 4.83848L16.7799 3.52848C16.4899 3.23848 16.4899 2.76848 16.7799 2.46848C17.0799 2.17848 17.5499 2.17848 17.8399 2.46848L19.6799 4.30848H19.6899V4.31848Z" fill="currentColor" />
      <path d="M2.46994 20.4684L5.31994 17.6184C5.46994 17.8184 5.62994 18.0084 5.80994 18.1884C5.98994 18.3684 6.17994 18.5284 6.37994 18.6784L3.52994 21.5284C3.37994 21.6784 3.18994 21.7484 2.99994 21.7484C2.80994 21.7484 2.61994 21.6784 2.46994 21.5284C2.17994 21.2384 2.17994 20.7684 2.46994 20.4684Z" fill="currentColor" />
      <path d="M11.6499 14.6684C11.3499 14.9584 11.3499 15.4284 11.6399 15.7284L13.7399 17.8384L14.8099 16.7784L12.7099 14.6684C12.4099 14.3784 11.9399 14.3784 11.6499 14.6684Z" fill="currentColor" />
      <path d="M13.1999 12.0485C12.8999 11.7585 12.8999 11.2885 13.1999 10.9885C13.4899 10.6985 13.9699 10.6985 14.2599 10.9885L17.4299 14.1585L16.3699 15.2185L13.1999 12.0485Z" fill="currentColor" />
    </svg>
  );
}

function MedicationIcon({ medication }: { medication: Medication }) {
  if (medication.form.toLowerCase().includes("inj")) {
    return <SyringeIcon />;
  }

  if (medication.form.toLowerCase().includes("cap")) {
    return <PillsBoxIcon />;
  }

  return <PillsIcon />;
}

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



function MedicationCard({ medication }: { medication: Medication }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.soft}
      className="med-card"
    >
      <div className="med-card__body">
        <div className={clsx("med-card__icon", `med-card__icon--${medication.tone}`)}>
          <MedicationIcon medication={medication} />
        </div>
        <div className="med-card__content">
          <div className="med-card__topline">
            <h2 className="med-card__name">
              {medication.name}
              <span className="med-card__brand">{medication.brand}</span>
            </h2>
            <span className={clsx("med-card__status-badge", `med-card__status-badge--${medication.tone}`)}>
              {formatStatusLabel(medication.status)}
            </span>
          </div>
          <p className="med-card__dosage">
            {medication.form} · {medication.dosage} · <span className={clsx("med-card__frequency", `med-card__frequency--${medication.tone}`)}>{medication.frequency}</span>
          </p>
          <span className="med-card__updated">{medication.lastUpdated}</span>
        </div>
      </div>

      <div className="med-card__footer">
        <p className="med-card__indication">{medication.indication}</p>
        <span className="med-card__meta">
          {medication.prescribedBy} · Review {medication.reviewDate}
        </span>
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
        <button
          className="subpage-header__action"
          type="button"
          onClick={() => navigate("/prescriptions", { state: { patientId: patient.id } })}
        >
          <PillIcon size={16} />
          <span>Rx</span>
        </button>
      </header>

      <div className="meds-body">
        {highlightedMedication ? (
          <div className="quiet-ai-banner">
            <span className="quiet-ai-banner__icon-wrap">
              <Sparkles size={14} className="quiet-ai-banner__icon" />
            </span>
            <p>Review <strong>{highlightedMedication.name}</strong> against recent fasting sugar and dialysis follow-up.</p>
          </div>
        ) : null}

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
