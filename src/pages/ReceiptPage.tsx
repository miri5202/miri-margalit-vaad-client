import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTransaction } from "../api/transactions";
import { getBuilding } from "../api/buildings";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { apartmentLabel, formatDate, formatMoney } from "../utils/format";
import { categoryLabels, paymentMethodLabels } from "../utils/labels";

function ReceiptPage() {
  const { buildingId, txId } = useParams();
  const id = Number(buildingId);

  const { data: tx, isLoading, isError } = useQuery({
    queryKey: ["transaction", id, txId],
    queryFn: () => getTransaction(id, Number(txId)),
  });

  const { data: building } = useQuery({
    queryKey: ["building", id],
    queryFn: () => getBuilding(id),
  });

  if (isLoading) return <Loader />;
  if (isError || !tx) return <ErrorMessage message="הקבלה לא נמצאה" />;

  return (
    <>
      <div className="actions no-print" style={{ justifyContent: "center", marginBottom: 20 }}>
        <button className="btn btn--primary" onClick={() => window.print()}>
          🖨️ הדפסה
        </button>
        <Link className="btn btn--secondary" to={-1 as unknown as string}>
          חזרה
        </Link>
      </div>

      <div className="receipt">
        <div className="receipt__header">
          <div>
            <h1>קבלה</h1>
            <div className="receipt__number">מס' {tx.id}</div>
          </div>
          <div>
            <strong>ועד הבית {building?.name}</strong>
            <div className="receipt__number">{building?.address}</div>
          </div>
        </div>

        <div className="receipt__row">
          <span>תאריך</span>
          <span>{formatDate(tx.date)}</span>
        </div>
        <div className="receipt__row">
          <span>התקבל מ</span>
          <span>{apartmentLabel(tx.apartment, tx.isUnit)}</span>
        </div>
        <div className="receipt__row">
          <span>עבור</span>
          <span>{tx.description ?? categoryLabels[tx.category]}</span>
        </div>
        <div className="receipt__row">
          <span>אמצעי תשלום</span>
          <span>{paymentMethodLabels[tx.paymentMethod]}</span>
        </div>

        <div className="receipt__total">
          <span>סה"כ שולם</span>
          <span className="num">{formatMoney(tx.amount)}</span>
        </div>

        <div className="receipt__footer">תודה! · ועד הבית</div>
      </div>
    </>
  );
}

export default ReceiptPage;