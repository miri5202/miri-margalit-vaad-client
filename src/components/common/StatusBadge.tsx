import type { Status } from "../../types";
import { statusLabels } from "../../utils/labels";

interface StatusBadgeProps {
  status: Status;
}

const COLORS: Record<Status, string> = {
  paid: "bg-mint",
  partial: "bg-half",
  pending: "bg-pending",
  late: "bg-late",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border-2 border-ink px-2 py-0.5 text-xs font-bold whitespace-nowrap text-deep ${COLORS[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default StatusBadge;
