import type { Category } from "../../types";
import { categoryLabels } from "../../utils/labels";
import { formatMoney } from "../../utils/format";

interface ExpenseChartProps {
  data: { category: Category; total: number }[];
}

function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return <p className="empty-state">עדיין אין הוצאות</p>;
  }

  const max = Math.max(...data.map((d) => d.total));

  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-row" key={d.category}>
          <span className="bar-label">{categoryLabels[d.category]}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(d.total / max) * 100}%` }} />
          </div>
          <span className="bar-value">{formatMoney(d.total)}</span>
        </div>
      ))}
    </div>
  );
}

export default ExpenseChart;