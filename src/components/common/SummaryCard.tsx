import { formatMoney } from "../../utils/format";

interface SummaryCardProps {
  label: string;                                         
  value: number;                                         
  variant?: "income" | "expense" | "debt" | "highlight";  
}

function SummaryCard({ label, value, variant }: SummaryCardProps) {
  const className = variant ? `stat-card stat-card--${variant}` : "stat-card";

  return (
    <div className={className}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value num">{formatMoney(value)}</div>
    </div>
  );
}

export default SummaryCard;