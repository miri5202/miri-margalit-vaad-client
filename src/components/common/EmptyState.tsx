import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: string;
  children: ReactNode;
}

// מצב ריק: אין מה להציג
function EmptyState({ icon, children }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border-[2.5px] border-ink bg-card px-6 py-12 text-center text-muted">
      <div className="mb-2 text-4xl" aria-hidden="true">
        {icon}
      </div>
      {children}
    </div>
  );
}

export default EmptyState;
