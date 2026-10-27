import type { Status } from "../../types";
import { statusLabels } from "../../utils/labels";

interface StatusBadgeProps {
  status: Status;
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge badge--${status}`}>
      {statusLabels[status]}
    </span>
  );
}

export default StatusBadge;