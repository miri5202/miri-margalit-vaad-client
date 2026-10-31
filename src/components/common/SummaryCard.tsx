import { formatMoney } from "../../utils/format";
import { cn } from "../../utils/ui";

interface SummaryCardProps {
  label: string;
  value: number;
  variant?: "income" | "expense" | "debt" | "highlight";
  note?: string;
}

const NOTE_STYLE = {
  highlight: "bg-sun -rotate-[1.5deg]",
  income: "bg-mint rotate-1",
  expense: "bg-blush rotate-[1.2deg]",
  debt: "bg-sky -rotate-1",
};

function SummaryCard({ label, value, variant = "highlight", note }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-md rounded-bl-2xl border-[2.5px] border-ink px-4 pt-4 pb-3 text-deep shadow-sketch",
        NOTE_STYLE[variant]
      )}
    >
      <span className="absolute -top-2.5 right-1/2 size-4 rounded-full border-2 border-ink bg-coral" aria-hidden="true" />
      <span className="block font-hand font-semibold">{label}</span>
      <strong className="num block text-right text-2xl sm:text-3xl font-extrabold">{formatMoney(value)}</strong>
      {note && <span className="text-xs text-deep/70">{note}</span>}
    </div>
  );
}

export default SummaryCard;
