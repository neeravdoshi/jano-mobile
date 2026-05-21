import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, FileText, Upload, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../design-system/components/Button";
import { motionTokens } from "../design-system/motion";
import { patients } from "../fixtures/patients";

type ReportsUploadPageProps = {
  kind?: "report" | "prescription";
};

const uploadCopy = {
  report: {
    pageTitle: "New report",
    heading: "Upload report",
    body: "Add a finished report, outside lab PDF, or scan for this patient. Supported file types: PDF, JPG, PNG.",
    button: "Select a file",
  },
  prescription: {
    pageTitle: "Upload prescription",
    heading: "Upload prescription",
    body: "Add an outside prescription, scanned Rx, or PDF for this patient. Supported file types: PDF, JPG, PNG.",
    button: "Select prescription",
  },
} as const;

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
}

export function ReportsUploadPage({ kind = "report" }: ReportsUploadPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const copy = uploadCopy[kind];

  return (
    <motion.div
      className="reports-upload-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">{copy.pageTitle}</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
      </header>

      <div className="reports-upload-body">
        <section className="reports-upload-panel">
          <motion.div
            className="reports-upload-illustration"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={motionTokens.spring.soft}
            aria-hidden="true"
          >
            <div className="reports-upload-illustration__field">
              <span className="reports-upload-illustration__wave" />
              <span className="reports-upload-illustration__wave reports-upload-illustration__wave--soft" />
            </div>
            <div className="reports-upload-illustration__core">
              <Upload size={28} strokeWidth={2.2} />
            </div>
          </motion.div>

          <div className="reports-upload-copy">
            <h2>{copy.heading}</h2>
            <p>{copy.body}</p>
          </div>

          <div className="reports-upload-actions">
            <input
              ref={inputRef}
              className="reports-upload-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            <Button className="reports-upload-select" onClick={() => inputRef.current?.click()}>
              {copy.button}
            </Button>
          </div>

          {selectedFile ? (
            <motion.div
              className="reports-upload-selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTokens.spring.soft}
            >
              <div className="reports-upload-selection__icon">
                <FileText size={18} />
              </div>
              <div className="reports-upload-selection__copy">
                <strong>{selectedFile.name}</strong>
                <span>{formatFileSize(selectedFile.size)}</span>
              </div>
              <button
                type="button"
                className="reports-upload-selection__clear"
                aria-label="Remove selected file"
                onClick={() => {
                  setSelectedFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : null}
        </section>
      </div>
    </motion.div>
  );
}
