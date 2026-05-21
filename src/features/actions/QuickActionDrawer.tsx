import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClipboardList, FileText, FlaskConical, Pill, X, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motionTokens } from "../../design-system/motion";
import { patients } from "../../fixtures/patients";

type QuickDrawerAction = {
  label: string;
  description: string;
  icon: LucideIcon;
  to: string;
  state?: Record<string, unknown>;
};

const patient = patients[0];

const drawerActions: QuickDrawerAction[] = [
  {
    label: "Add Note",
    description: "Capture a progress note",
    icon: ClipboardList,
    to: "/notes/new?type=progress",
    state: { patientId: patient.id },
  },
  {
    label: "Add RX",
    description: "Start a prescription",
    icon: FileText,
    to: "/prescriptions/new",
    state: { patientId: patient.id, mode: "typed" },
  },
  {
    label: "Order Meds",
    description: "Review medication orders",
    icon: Pill,
    to: "/medications",
    state: { patientId: patient.id },
  },
  {
    label: "Order Lab",
    description: "Add a new report",
    icon: FlaskConical,
    to: "/reports/new",
    state: { patientId: patient.id },
  },
];

export function QuickActionDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleQuickAction() {
      setOpen(true);
    }

    window.addEventListener("jano:quick-action", handleQuickAction);
    return () => window.removeEventListener("jano:quick-action", handleQuickAction);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function handleAction(action: QuickDrawerAction) {
    setOpen(false);
    navigate(action.to, { state: action.state });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="quick-drawer-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            className="quick-drawer__scrim"
            type="button"
            aria-label="Close quick actions"
            onClick={() => setOpen(false)}
          />
          <motion.section
            className="quick-drawer"
            aria-label="Quick actions"
            initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0.96 }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0.96 }}
            transition={motionTokens.spring.sheet}
          >
            <span className="quick-drawer__handle" aria-hidden="true" />
            <div className="quick-drawer__header">
              <div className="quick-drawer__header-copy">
                <p className="quick-drawer__eyebrow">Quick actions</p>
              </div>
              <button
                className="quick-drawer__close"
                type="button"
                aria-label="Close quick actions"
                onClick={() => setOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="quick-drawer__list">
              {drawerActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    className="quick-drawer__action"
                    key={action.label}
                    type="button"
                    onClick={() => handleAction(action)}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  >
                    <span className="quick-drawer__action-icon">
                      <Icon size={19} />
                    </span>
                    <span className="quick-drawer__action-copy">
                      <span className="quick-drawer__action-label">{action.label}</span>
                      <span className="quick-drawer__action-description">{action.description}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
