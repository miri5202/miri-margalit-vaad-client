import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTransaction } from "../api/transactions";
import { getBuilding } from "../api/buildings";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Logo from "../components/ui/Logo";
import { apartmentLabel, formatDate, formatMoney } from "../utils/format";
import { categoryLabels, paymentMethodLabels } from "../utils/labels";
import { btn } from "../utils/ui";

function ReceiptPage() {
  const { buildingId, txId } = useParams();
  const id = Number(buildingId);
  const navigate = useNavigate();

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

  const rows = [
    { label: "תאריך", value: formatDate(tx.date) },
    { label: "התקבל מ", value: apartmentLabel(tx.apartment, tx.isUnit) },
    { label: "עבור", value: tx.description ?? categoryLabels[tx.category] },
    { label: "אמצעי תשלום", value: paymentMethodLabels[tx.paymentMethod] },
  ];

  return (
    <>
      {/* print:hidden - הכפתורים לא מודפסים */}
      <div className="mb-6 flex justify-center gap-3 print:hidden">
        <button className={btn("primary")} onClick={() => window.print()}>
          🖨️ הדפסה
        </button>
        <button className={btn("secondary")} onClick={() => navigate(-1)}>
          חזרה
        </button>
      </div>

      <div className="relative mx-auto max-w-xl rounded-md border-[2.5px] border-ink bg-card px-8 pt-10 pb-8 shadow-sketch-lg print:border-0 print:shadow-none">
        {/* נייר דבק */}
        <span className="absolute -top-3 right-1/2 h-6 w-28 translate-x-1/2 -rotate-2 bg-sun/75 print:hidden" aria-hidden="true" />

        <div className="mb-4 flex items-start justify-between gap-4 border-b-[2.5px] border-ink pb-4">
          <div>
            <h1 className="text-4xl">קבלה</h1>
            <div className="text-sm text-muted">מס' {tx.id}</div>
          </div>
          <div className="flex items-center gap-2 text-left">
            <div>
              <strong className="block">ועד הבית {building?.name}</strong>
              <span className="text-sm text-muted">{building?.address}</span>
            </div>
            <Logo className="size-10" />
          </div>
        </div>

        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b-2 border-dashed border-line py-2.5">
            <span className="text-muted">{row.label}</span>
            <span className="font-semibold">{row.value}</span>
          </div>
        ))}

        <div className="mt-5 flex items-center justify-between rounded-2xl border-2 border-ink bg-sun px-4 py-3 text-xl font-extrabold text-deep">
          <span className="font-hand">סה"כ שולם</span>
          <span className="num">{formatMoney(tx.amount)}</span>
        </div>

        <p className="mt-7 text-center font-hand text-muted">תודה! · ועד הבית</p>
      </div>
    </>
  );
}

export default ReceiptPage;
