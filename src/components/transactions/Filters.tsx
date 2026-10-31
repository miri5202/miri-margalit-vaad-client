import type { TransactionFilters, TransactionType, Status } from "../../types";
import { statusLabels, typeLabels } from "../../utils/labels";
import { input } from "../../utils/ui";

interface FiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  function update(changes: Partial<TransactionFilters>) {
    onChange({ ...filters, ...changes, page: 1 });
  }

  return (
    <div className="mb-5 grid gap-3 rounded-3xl border-2 border-dashed border-line p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
      <input
        className={input()}
        aria-label="חיפוש"
        placeholder="🔍 חיפוש בתיאור או בספק..."
        value={filters.search ?? ""}
        onChange={(e) => update({ search: e.target.value || undefined })}
      />

      <select
        className={input()}
        aria-label="סוג"
        value={filters.type ?? ""}
        onChange={(e) => update({ type: (e.target.value || undefined) as TransactionType | undefined })}
      >
        <option value="">כל הסוגים</option>
        {Object.entries(typeLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        className={input()}
        aria-label="סטטוס"
        value={filters.status ?? ""}
        onChange={(e) => update({ status: (e.target.value || undefined) as Status | undefined })}
      >
        <option value="">כל הסטטוסים</option>
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        className={input()}
        aria-label="חודש"
        type="month"
        value={filters.month ?? ""}
        onChange={(e) => update({ month: e.target.value || undefined })}
      />
    </div>
  );
}

export default Filters;
