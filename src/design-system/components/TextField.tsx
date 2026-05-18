import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function TextField({ className, hint, id, label, ...props }: TextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field__label">{label}</span>
      <input className={clsx("field__input", className)} id={fieldId} {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}
