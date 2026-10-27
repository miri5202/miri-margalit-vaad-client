import type { TransactionFilters, TransactionType, Status } from "../../types";
import { statusLabels, typeLabels } from "../../utils/labels";

interface FiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  function update(changes: Partial<TransactionFilters>) {
    onChange({ ...filters, ...changes, page: 1 });
  }

  return (
    <div className="filters">
      <input
        className="input input--search"
        placeholder="🔍 חיפוש בתיאור או בספק..."
        value={filters.search ?? ""}
        onChange={(e) => update({ search: e.target.value || undefined })}
      />

      <select
        className="input"
        value={filters.type ?? ""}
        onChange={(e) => update({ type: (e.target.value || undefined) as TransactionType | undefined })}
      >
        <option value="">כל הסוגים</option>
        {Object.entries(typeLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        className="input"
        value={filters.status ?? ""}
        onChange={(e) => update({ status: (e.target.value || undefined) as Status | undefined })}
      >
        <option value="">כל הסטטוסים</option>
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <input
        className="input"
        type="month"
        value={filters.month ?? ""}
        onChange={(e) => update({ month: e.target.value || undefined })}
      />
    </div>
  );
}

export default Filters;