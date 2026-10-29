import { Link } from "react-router-dom";
import type { BuildingWithStats } from "../../types";
import { formatMoney } from "../../utils/format";
import Logo from "../ui/Logo";

interface BuildingCardProps {
  building: BuildingWithStats;
}

// כרטיס בניין בעמוד "הבניינים שלי"
function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Link
      to={`/buildings/${building.id}`}
      className="group flex flex-col gap-4 rounded-3xl border-[2.5px] border-ink bg-card p-5 text-ink no-underline shadow-sketch transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sketch-lg"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-soft transition-transform group-hover:-rotate-6">
          <Logo className="size-10" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl">{building.name}</h3>
          <div className="truncate text-sm text-muted">
            {building.address}, {building.city}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border-2 border-dashed border-line p-3">
        <div>
          <span className="block text-xs text-muted">דיירים</span>
          <strong className="num block text-right">{building.residentsCount}</strong>
        </div>
        <div>
          <span className="block text-xs text-muted">יתרה</span>
          <strong className="num block text-right">{formatMoney(building.balance)}</strong>
        </div>
        <div>
          <span className="block text-xs text-muted">חובות</span>
          <strong className="num block text-right">{formatMoney(building.totalDebt)}</strong>
        </div>
      </div>
    </Link>
  );
}

export default BuildingCard;
