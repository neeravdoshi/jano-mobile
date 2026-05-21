import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  FlaskConical,
  FileText,
  MessageSquareMore,
  Pill as PillIcon,
  ScanText,
  SlidersHorizontal,
  TrendingUp,
  Droplets,
  NotebookText,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card } from "../design-system/components/Card";
import { IconButton } from "../design-system/components/IconButton";
import { SectionHeading } from "../design-system/components/SectionHeading";
import { motionTokens } from "../design-system/motion";
import {
  AttentionStack,
  type AttentionItem
} from "../features/patients/components/AttentionStack";
import { patients } from "../fixtures/patients";

const quickActions = [
  { icon: FileText, label: "Prescription", to: "/prescriptions" },
  { icon: PillIcon, label: "Medications", to: "/medications" },
  { icon: NotebookText, label: "Notes", to: "/notes" },
  { icon: TrendingUp, label: "Reports", to: "/trends" },
  { icon: Droplets, label: "Dialysis", to: "/dialysis" },
  { icon: MessageSquareMore, label: "Chat", to: "/chat" },
] as const;

const attentionItems: AttentionItem[] = [
  {
    id: "high-potassium",
    eyebrow: "Urgent lab alert",
    title: "High potassium: 6.1 mEq/L",
    body: "Latest pathology value is elevated and needs confirmation before prescription changes.",
    detail: "Elevated 1 hr ago",
    cta: "View trends",
    tone: "danger"
  },
  {
    id: "dialysis-missed",
    eyebrow: "Care gap",
    title: "Missed dialysis session",
    body: "Yesterday's MHD attendance is unconfirmed and follow-up is pending with the patient.",
    detail: "12 Apr 2025",
    cta: "Open outreach",
    tone: "warning"
  },
  {
    id: "prescription-review",
    eyebrow: "Prescription",
    title: "Refill needs dosage review",
    body: "Insulin glargine refill was requested, but recent fasting sugars and dialysis logs suggest a dose review first.",
    detail: "2 meds pending",
    cta: "Review Rx",
    tone: "success"
  }
];

type TimelineEntryBase = {
  id: string;
  date: string;
  category: string;
  icon: LucideIcon;
  title: string;
  meta: string;
};

type TimelineEntry =
  | (TimelineEntryBase & {
      variant: "consult";
      summary: string;
      bullets: string[];
      prescription?: { title: string; subtitle: string };
    })
  | (TimelineEntryBase & {
      variant: "session";
      summary: string;
      metrics: Array<{ label: string; value: string }>;
    })
  | (TimelineEntryBase & {
      variant: "report";
      summary: string;
      attachments: Array<{ title: string; subtitle: string }>;
    })
  | (TimelineEntryBase & {
      variant: "medication";
      summary: string;
      medication: {
        name: string;
        detail: string;
        schedule: string;
        change: string;
      };
    })
  | (TimelineEntryBase & {
      variant: "procedure";
      summary: string;
      notes: string[];
      attachment: { title: string; subtitle: string };
    })
  | (TimelineEntryBase & {
      variant: "note";
      bullets: string[];
    });

const timelineEntries: TimelineEntry[] = [
  {
    id: "consult-08-apr",
    date: "08 Apr 2026",
    category: "OPD consult",
    variant: "consult",
    title: "OPD consultation",
    meta: "Dr. Mehta · Nephrology",
    summary: "Reviewed dry-weight trend and tightened BP guidance for the coming week.",
    bullets: ["Repeat home BP log in 7 days"],
    prescription: {
      title: "Consult prescription",
      subtitle: "BP meds + renal diet advice"
    },
    icon: FileText
  },
  {
    id: "medication-05-apr",
    date: "05 Apr 2026",
    category: "Medication",
    variant: "medication",
    title: "Metformin discontinued",
    meta: "eGFR decline · Dr. Patel · Endocrinology",
    summary: "Metformin stopped after eGFR dropped below the safe threshold. Diabetes plan revised with Endocrinology.",
    medication: {
      name: "Metformin",
      detail: "500 mg",
      schedule: "Twice daily · Oral",
      change: "Stopped"
    },
    icon: PillIcon
  },
  {
    id: "dialysis-05-apr",
    date: "05 Apr 2026",
    category: "Dialysis",
    variant: "session",
    title: "MHD dialysis session",
    meta: "4 hr session · Good tolerance",
    summary: "Session completed without escalation and tolerance remained stable.",
    metrics: [
      { label: "Duration", value: "4 hr" },
      { label: "Pre BP", value: "140/90" }
    ],
    icon: Droplets
  },
  {
    id: "pathology-02-apr",
    date: "02 Apr 2026",
    category: "Pathology",
    variant: "report",
    title: "KFT lab uploaded",
    meta: "Creatinine, GFR, K+, P+",
    summary: "Renal panel and comparison trend were added to the chart.",
    attachments: [
      { title: "KFT panel", subtitle: "4 parameters flagged" },
      { title: "Trend sheet", subtitle: "3-month comparison" }
    ],
    icon: FlaskConical
  },
  {
    id: "medication-28-mar",
    date: "28 Mar 2026",
    category: "Medication",
    variant: "medication",
    title: "Insulin changed",
    meta: "Dose updated after sugar review",
    summary: "Basal insulin was reduced after recurring morning lows.",
    medication: {
      name: "Insulin glargine",
      detail: "10 IU",
      schedule: "Nightly · SC",
      change: "Reduced from 14 IU"
    },
    icon: PillIcon
  },
  {
    id: "dialysis-review-18-mar",
    date: "18 Mar 2026",
    category: "Care note",
    variant: "note",
    title: "Dialysis regimen reviewed",
    meta: "Nephrology + dialysis unit",
    bullets: ["Dry weight revised after 2-week review", "Monitor post-session cramps closely"],
    icon: NotebookText
  },
  {
    id: "procedure-15-mar",
    date: "15 Mar 2026",
    category: "Procedure",
    variant: "procedure",
    title: "Catheter surgery",
    meta: "Post-op care attached",
    summary: "Permanent catheter surgery completed and post-op instructions were filed.",
    notes: ["Wound review advised in 48 hr"],
    attachment: {
      title: "Post-op care plan",
      subtitle: "Wound care and review schedule"
    },
    icon: ScanText
  },
  {
    id: "medication-03-mar",
    date: "03 Mar 2026",
    category: "Medication",
    variant: "medication",
    title: "Amlodipine paused",
    meta: "Low BP during MHD · Dr. Smith · Cardiology",
    summary: "Amlodipine temporarily held after blood pressure dropped during MHD week. Review scheduled when pressure stabilises.",
    medication: {
      name: "Amlodipine",
      detail: "5 mg",
      schedule: "Once daily · Oral",
      change: "Paused"
    },
    icon: PillIcon
  },
  {
    id: "medication-20-feb",
    date: "20 Feb 2026",
    category: "Medication",
    variant: "medication",
    title: "Metformin started",
    meta: "Diabetes management · Dr. Patel · Endocrinology",
    summary: "Metformin added to manage blood sugar alongside the ongoing dialysis regimen after endocrine review.",
    medication: {
      name: "Metformin",
      detail: "500 mg",
      schedule: "Twice daily · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "medication-12-jan",
    date: "12 Jan 2026",
    category: "Medication",
    variant: "medication",
    title: "EPO therapy started",
    meta: "Anaemia management · Dr. Girish · Nephrology",
    summary: "Erythropoietin alfa started for dialysis-related anaemia. Haemoglobin target set at 10–11 g/dL.",
    medication: {
      name: "Erythropoietin alfa",
      detail: "4000 IU",
      schedule: "3x / week · SC",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "medication-03-jan",
    date: "03 Jan 2026",
    category: "Medication",
    variant: "medication",
    title: "Amlodipine added",
    meta: "BP control · Dr. Smith · Cardiology",
    summary: "Amlodipine added after home BP logs showed persistent hypertension between dialysis sessions.",
    medication: {
      name: "Amlodipine",
      detail: "5 mg",
      schedule: "Once daily · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "session-24-sep",
    date: "24 Sep 2025",
    category: "Dialysis",
    variant: "session",
    title: "Dialysis initiated",
    meta: "First supervised MHD session",
    summary: "First session completed under close observation with mild fatigue but no intradialytic hypotension.",
    metrics: [
      { label: "Duration", value: "3 hr" },
      { label: "UF", value: "1.2 L" },
      { label: "Post BP", value: "132/84" }
    ],
    icon: Droplets
  },
  {
    id: "procedure-18-sep",
    date: "18 Sep 2025",
    category: "Procedure",
    variant: "procedure",
    title: "Dialysis access placed",
    meta: "Temporary catheter insertion",
    summary: "Temporary dialysis access was inserted after counseling on urgent initiation and access care.",
    notes: ["Consent documented", "Access-site care explained to family"],
    attachment: {
      title: "Access care instructions",
      subtitle: "Red flags, hygiene, review steps"
    },
    icon: ScanText
  },
  {
    id: "medication-03-sep",
    date: "03 Sep 2025",
    category: "Medication",
    variant: "medication",
    title: "Phosphate binder started",
    meta: "Dialysis prep · Dr. Mehta · Nephrology",
    summary: "Calcium acetate started to control phosphorus levels ahead of dialysis initiation.",
    medication: {
      name: "Calcium acetate",
      detail: "667 mg",
      schedule: "With meals · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "treatment-plan-03-sep",
    date: "03 Sep 2025",
    category: "Care note",
    variant: "note",
    title: "Treatment plan finalized",
    meta: "Nephrology treatment conference",
    bullets: ["Hemodialysis advised three times weekly", "Access placement scheduled after counseling"],
    icon: NotebookText
  },
  {
    id: "medication-20-aug",
    date: "20 Aug 2025",
    category: "Medication",
    variant: "medication",
    title: "CKD medications started",
    meta: "Initial renal regimen · Dr. Mehta · Nephrology",
    summary: "Torsemide and sodium bicarbonate started for volume control and metabolic acidosis management.",
    medication: {
      name: "Torsemide + sodium bicarbonate",
      detail: "20 mg / 650 mg",
      schedule: "Morning / Twice daily · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "workup-review-12-aug",
    date: "12 Aug 2025",
    category: "OPD consult",
    variant: "consult",
    title: "CKD workup review",
    meta: "Dr. Mehta · Nephrology",
    summary: "Follow-up labs confirmed progression and dialysis planning was discussed with family.",
    bullets: ["Repeat anemia and iron profile ordered"],
    prescription: {
      title: "Workup follow-up prescription",
      subtitle: "Labs + supportive medication plan"
    },
    icon: FileText
  },
  {
    id: "followup-tests-29-jul",
    date: "29 Jul 2025",
    category: "Pathology",
    variant: "report",
    title: "Specialized workup ordered",
    meta: "Iron profile, viral markers, calcium-phosphorus",
    summary: "Extended workup was added after baseline renal impairment was confirmed.",
    attachments: [
      { title: "Follow-up lab order", subtitle: "Iron profile · PTH · Viral markers" },
      { title: "Imaging request", subtitle: "Renal ultrasound + access assessment" }
    ],
    icon: FlaskConical
  },
  {
    id: "baseline-report-25-jul",
    date: "25 Jul 2025",
    category: "Pathology",
    variant: "report",
    title: "Baseline reports uploaded",
    meta: "Creatinine 5.8 · eGFR 11 · Hb 8.9",
    summary: "Initial outside reports were added and marked for urgent nephrology review.",
    attachments: [
      { title: "Outside lab bundle", subtitle: "CBC, KFT, urine protein" },
      { title: "Referral note", subtitle: "Primary physician summary" }
    ],
    icon: FlaskConical
  },
  {
    id: "first-consult-22-jul",
    date: "22 Jul 2025",
    category: "OPD consult",
    variant: "consult",
    title: "First nephrology visit",
    meta: "Relationship begins · Dr. Mehta",
    summary: "Patient presented with fatigue, swelling, and reduced urine output with outside reports suggesting advanced kidney disease.",
    bullets: ["Baseline renal workup advised"],
    icon: FileText
  }
];

function TimelineAttachment({
  title,
  subtitle,
  wide = false
}: {
  title: string;
  subtitle: string;
  wide?: boolean;
}) {
  return (
      <div className={`timeline-card__attachment${wide ? " timeline-card__attachment--wide" : ""}`}>
      <div className="timeline-card__attachment-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <span className="timeline-card__attachment-link" aria-hidden="true">
        <ArrowUpRight size={13} />
      </span>
    </div>
  );
}

function renderTimelineCard(entry: TimelineEntry) {
  switch (entry.variant) {
    case "consult":
      return (
        <Card className="timeline-card timeline-card--consult">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
          <ul className="timeline-card__bullets">
            {entry.bullets.slice(0, 1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {entry.prescription ? (
            <TimelineAttachment
              title={entry.prescription.title}
              subtitle={entry.prescription.subtitle}
              wide
            />
          ) : null}
        </Card>
      );
    case "session":
      return (
        <Card className="timeline-card timeline-card--session">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <div className="timeline-card__metrics">
            {entry.metrics.slice(0, 2).map((metric) => (
              <div className="timeline-card__metric" key={metric.label}>
                <span className="timeline-card__metric-label">{metric.label}</span>
                <strong className="timeline-card__metric-value">{metric.value}</strong>
              </div>
            ))}
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
        </Card>
      );
    case "report":
      return (
        <Card className="timeline-card timeline-card--report">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
          <div className="timeline-card__attachments">
            {entry.attachments.slice(0, 1).map((attachment) => (
              <TimelineAttachment
                key={attachment.title}
                title={attachment.title}
                subtitle={attachment.subtitle}
              />
            ))}
          </div>
        </Card>
      );
    case "medication":
      return (
        <Card className="timeline-card timeline-card--medication">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <div className="timeline-card__med-row">
            <div className="timeline-card__med-copy">
              <strong>{entry.medication.name}</strong>
              <span>
                {entry.medication.detail} · {entry.medication.schedule}
              </span>
            </div>
            <span className="timeline-card__med-badge">{entry.medication.change}</span>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
        </Card>
      );
    case "procedure":
      return (
        <Card className="timeline-card timeline-card--procedure">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
          <ul className="timeline-card__bullets">
            {entry.notes.slice(0, 1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <TimelineAttachment
            title={entry.attachment.title}
            subtitle={entry.attachment.subtitle}
            wide
          />
        </Card>
      );
    case "note":
      return (
        <Card className="timeline-card timeline-card--note">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <ul className="timeline-card__bullets timeline-card__bullets--spacious">
            {entry.bullets.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      );
  }
}

function getTimelineSearchText(entry: TimelineEntry) {
  const shared = [entry.date, entry.category, entry.title, entry.meta];

  switch (entry.variant) {
    case "consult":
      return [
        ...shared,
        entry.summary,
        ...entry.bullets,
        entry.prescription?.title ?? "",
        entry.prescription?.subtitle ?? ""
      ].join(" ");
    case "session":
      return [
        ...shared,
        entry.summary,
        ...entry.metrics.flatMap((metric) => [metric.label, metric.value])
      ].join(" ");
    case "report":
      return [
        ...shared,
        entry.summary,
        ...entry.attachments.flatMap((attachment) => [attachment.title, attachment.subtitle])
      ].join(" ");
    case "medication":
      return [
        ...shared,
        entry.summary,
        entry.medication.name,
        entry.medication.detail,
        entry.medication.schedule,
        entry.medication.change
      ].join(" ");
    case "procedure":
      return [
        ...shared,
        entry.summary,
        ...entry.notes,
        entry.attachment.title,
        entry.attachment.subtitle
      ].join(" ");
    case "note":
      return [...shared, ...entry.bullets].join(" ");
  }
}

export function TodayPage() {
  const navigate = useNavigate();
  const [attentionDismissed, setAttentionDismissed] = useState(false);
  const [timelineQuery, setTimelineQuery] = useState("");
  const featuredPatient = patients[0];
  const normalizedTimelineQuery = timelineQuery.trim().toLowerCase();
  const filteredTimelineEntries = useMemo(() => {
    if (!normalizedTimelineQuery) {
      return timelineEntries;
    }

    return timelineEntries.filter((entry) =>
      getTimelineSearchText(entry).toLowerCase().includes(normalizedTimelineQuery)
    );
  }, [normalizedTimelineQuery]);

  return (
    <motion.div
      className="page-stack"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <AnimatePresence initial={false}>
        {!attentionDismissed ? (
          <motion.div
            key="attention-block"
            className="page-section"
            layout
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={motionTokens.spring.sheet}
          >
          <SectionHeading eyebrow="Needs attention" />
          <AttentionStack items={attentionItems} onEmpty={() => setAttentionDismissed(true)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.section className="page-section" layout transition={motionTokens.spring.sheet}>
        <SectionHeading eyebrow="Quick access" />
        <div className="quick-grid">
          {quickActions.map(({ icon: Icon, label, to }) => (
            <button
              className="quick-action"
              key={label}
              type="button"
              onClick={
                to
                  ? () =>
                      navigate(to, {
                        state:
                          label === "Reports" ||
                          label === "Medications" ||
                          label === "Notes" ||
                          label === "Chat" ||
                          label === "Prescription" ||
                          label === "Dialysis"
                            ? { patientId: featuredPatient.id }
                            : undefined
                      })
                  : undefined
              }
            >
              <span className="quick-action__icon">
                <Icon size={18} />
              </span>
              <span className="quick-action__label">{label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section className="page-section" transition={motionTokens.spring.sheet}>
        <SectionHeading eyebrow="Clinical Record" />
        <div className="timeline-toolbar">
          <label className="timeline-toolbar__search">
            <Search size={16} />
            <input
              type="text"
              value={timelineQuery}
              onChange={(event) => setTimelineQuery(event.target.value)}
              aria-label="Search timeline"
              placeholder="Search history"
            />
          </label>
          <IconButton icon={SlidersHorizontal} label="Filter timeline" />
        </div>
        <div className="timeline-list">
          {filteredTimelineEntries.map((entry) => (
            <div className="timeline-entry" key={entry.id}>
              <div className="timeline-entry__rail">
                <span className="timeline-entry__dot" />
                <span className="timeline-entry__line" />
              </div>
              <div className="timeline-entry__content">
                <div className="timeline-entry__stamp">
                  <p className="timeline-entry__date">{entry.date}</p>
                  <span className={`timeline-entry__category timeline-entry__category--${entry.variant}`}>
                    {entry.category}
                  </span>
                </div>
                {renderTimelineCard(entry)}
              </div>
            </div>
          ))}
          {filteredTimelineEntries.length === 0 ? (
            <Card className="timeline-card timeline-card--empty">
              <div className="timeline-card__heading-group">
                <h3 className="timeline-card__title">No matching records</h3>
                <p className="timeline-card__meta">
                  Try a diagnosis, medication, procedure, or lab term.
                </p>
              </div>
            </Card>
          ) : null}
        </div>
      </motion.section>
    </motion.div>
  );
}
