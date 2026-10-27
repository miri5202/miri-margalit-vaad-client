import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentsGrid } from "../api/summary";
import { createCharges } from "../api/charges";
import type { PaymentCellStatus } from "../types";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { getErrorMessage } from "../utils/errors";

const MONTHS = ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"];

const SYMBOLS: Record<PaymentCellStatus, string> = {
  paid: "✓",
  pending: "…",
  late: "!",
  none: "–",
};

const currentMonth = new Date().toISOString().slice(0, 7);

function PaymentGridPage() {
  const { buildingId } = useParams();
  const id = Number(buildingId);
  const [year, setYear] = useState(new Date().getFullYear());
  const queryClient = useQueryClient();

  const { data: grid, isLoading, isError } = useQuery({
    queryKey: ["payments-grid", id, year],
    queryFn: () => getPaymentsGrid(id, year),
  });

  const chargeMutation = useMutation({
    mutationFn: () => createCharges(id, currentMonth),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments-grid", id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      queryClient.invalidateQueries({ queryKey: ["summary", id] });
    },
  });

  if (isLoading) return <Loader />;
  if (isError || !grid) return <ErrorMessage message="לא הצחלנו לטעון את העמוד " />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>מי שילם - {grid.year}</h1>
          <p>דמי ועד לפי דירה וחודש</p>
        </div>
        <div className="actions">
          <button className="btn btn--secondary" onClick={() => setYear(year - 1)}>
            › שנה קודמת
          </button>
          <button className="btn btn--secondary" onClick={() => setYear(year + 1)}>
            שנה הבאה ‹
          </button>
          <button
            className="btn btn--accent"
            onClick={() => chargeMutation.mutate()}
            disabled={chargeMutation.isPending}
          >
            {chargeMutation.isPending ? "יוצר..." : "צור חיובי החודש"}
          </button>
        </div>
      </div>

      {chargeMutation.isSuccess && (
        <div className="alert alert--success">
          נוצרו {chargeMutation.data.created} חיובים חדשים
          {chargeMutation.data.skipped > 0 && ` (${chargeMutation.data.skipped} דירות כבר חויבו)`}
        </div>
      )}
      {chargeMutation.isError && <ErrorMessage message={getErrorMessage(chargeMutation.error)} />}

      <div className="table-wrap section">
        <table className="table pay-grid">
          <thead>
            <tr>
              <th>דירה</th>
              {MONTHS.map((m) => (
                <th key={m}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((row) => (
              <tr key={row.apartment}>
                <td>
                  <strong>דירה {row.apartment}</strong>{" "}
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {row.residents.join(", ")}
                  </span>
                </td>
                {row.months.map((status, i) => (
                  <td key={i}>
                    <span className={`pay-cell pay-cell--${status}`}>{SYMBOLS[status]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <span><i className="pay-cell pay-cell--paid">✓</i> שולם</span>
        <span><i className="pay-cell pay-cell--pending">…</i> ממתין</span>
        <span><i className="pay-cell pay-cell--late">!</i> באיחור</span>
        <span><i className="pay-cell pay-cell--none">–</i> לא חויב</span>
      </div>
    </>
  );
}

export default PaymentGridPage;