import type { ReactNode } from "react";

interface FieldProps {
  label: ReactNode;
  htmlFor?: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

// שדה בטופס: כותרת, השדה עצמו (children), ומתחתיו שגיאה או הסבר קטן
function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <span className="text-sm font-medium text-late-text dark:text-late">{error}</span>
      ) : (
        hint && <span className="text-sm text-muted">{hint}</span>
      )}
    </div>
  );
}

export default Field;
