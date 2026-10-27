import { Link } from "react-router-dom";
import type { BuildingWithStats } from "../../types";
import { formatMoney } from "../../utils/format";

interface BuildingCardProps {
  building: BuildingWithStats;
}

function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Link className="building-card" to={`/buildings/${building.id}`}>
      <div className="building-card__top">
        <div className="building-card__icon">🏢</div>
        <div>
          <h3 className="building-card__name">{building.name}</h3>
          <div className="building-card__address">
            {building.address}, {building.city}
          </div>
        </div>
      </div>

      <div className="building-card__stats">
        <div>
          <span>דיירים</span>
          <strong className="num">{building.residentsCount}</strong>
        </div>
        <div>
          <span>יתרה</span>
          <strong className="num">{formatMoney(building.balance)}</strong>
        </div>
        <div>
          <span>חובות</span>
          <strong className="num">{formatMoney(building.totalDebt)}</strong>
        </div>
      </div>
    </Link>
  );
}

export default BuildingCard;