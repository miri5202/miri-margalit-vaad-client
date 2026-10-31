import type { Category } from "../../types";
import { categoryLabels } from "../../utils/labels";
import { formatMoney } from "../../utils/format";

interface ExpenseChartProps {
  data: { category: Category; total: number }[];
}

function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-muted">עדיין אין הוצאות</p>;
  }

  const max = Math.max(...data.map((d) => d.total));

  return (
    <div className="grid gap-3">
      {data.map((d) => (
        <div className="grid grid-cols-[72px_1fr_76px] items-center gap-3 text-sm" key={d.category}>
          <span className="font-medium">{categoryLabels[d.category]}</span>
          <div className="h-[18px] overflow-hidden rounded-full border-2 border-ink bg-paper">
            <div className="h-full border-e-2 border-ink bg-stripes" style={{ width: `${(d.total / max) * 100}%` }} />
          </div>
          <b className="num text-left">{formatMoney(d.total)}</b>
        </div>
      ))}
    </div>
  );
}

export default ExpenseChart;
