import type { ReactNode } from "react";

export function FormField({ label, children, help, error }: { label: string; children: ReactNode; help?: string; error?: string }) {
  return (
    <label className="form-row">
      <span>{label}</span>
      {children}
      {help ? <span className="form-help">{help}</span> : null}
      {error ? <span className="error">{error}</span> : null}
    </label>
  );
}
