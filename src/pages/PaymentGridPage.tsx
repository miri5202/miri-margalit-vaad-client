import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentsGrid } from "../api/summary";
import { createCharges } from "../api/charges";
import type { PaymentCellStatus } from "../types";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/ui/PageHeader";
import { getErrorMessage } from "../utils/errors";
import { apartmentLabel } from "../utils/format";
import { btn, cn, table, tableWrap, td, th } from "../utils/ui";

const MONTHS = ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"];

// כל משבצת - "חלון" קטן, באותם צבעים כמו באיור הבניין
const CELL: Record<PaymentCellStatus, { symbol: string; className: string; label: string }> = {
  paid: { symbol: "✓", className: "bg-sun text-deep", label: "שולם" },
  partial: { symbol: "½", className: "bg-half text-deep", label: "שולם חלקית" },
  pending: { symbol: "…", className: "bg-pending text-deep", label: "ממתין" },
  late: { symbol: "!", className: "bg-late text-deep", label: "באיחור" },
  none: { symbol: "–", className: "bg-card text-muted border-dashed", label: "לא חויב" },
};

const cellBase = "inline-grid h-7 w-9 place-items-center rounded-md border-2 border-ink text-sm font-extrabold not-italic";

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
  if (isError || !grid) return <ErrorMessage message="לא הצלחנו לטעון את העמוד" />;

  return (
    <>
      <PageHeader title={`מי שילם - ${grid.year}`} subtitle="דמי ועד לפי דירה וחודש">
        <button className={btn("secondary", "sm")} onClick={() => setYear(year - 1)}>
          › שנה קודמת
        </button>
        <button className={btn("secondary", "sm")} onClick={() => setYear(year + 1)}>
          שנה הבאה ‹
        </button>
        <button className={btn("primary")} onClick={() => chargeMutation.mutate()} disabled={chargeMutation.isPending}>
          {chargeMutation.isPending ? "יוצר..." : "צור חיובי החודש"}
        </button>
      </PageHeader>

      {chargeMutation.isSuccess && (
        <div className="mb-4 rounded-2xl border-2 border-ink bg-mint px-4 py-3 font-medium text-deep" role="status">
          ✓ נוצרו {chargeMutation.data.created} חיובים חדשים
          {chargeMutation.data.skipped > 0 && ` (${chargeMutation.data.skipped} דירות כבר חויבו)`}
        </div>
      )}
      {chargeMutation.isError && <ErrorMessage message={getErrorMessage(chargeMutation.error)} />}

      <div className={tableWrap}>
        <table className={table}>
          <thead>
            <tr>
              <th className={th}>דירה</th>
              {MONTHS.map((m) => (
                <th key={m} className={cn(th, "text-center")}>
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((row) => (
              <tr key={`${row.apartment}-${row.isUnit}`} className="hover:bg-soft">
                <td className={cn(td, "whitespace-nowrap")}>
                  <strong>{apartmentLabel(row.apartment, row.isUnit)}</strong>{" "}
                  <span className="text-xs text-muted">{row.residents.join(", ")}</span>
                </td>
                {row.months.map((status, i) => (
                  <td key={i} className={cn(td, "px-1.5 text-center")}>
                    <span className={cn(cellBase, CELL[status].className)} title={`${MONTHS[i]}: ${CELL[status].label}`}>
                      {CELL[status].symbol}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {(Object.keys(CELL) as PaymentCellStatus[]).map((status) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <i className={cn(cellBase, "h-6 w-7 text-xs", CELL[status].className)}>{CELL[status].symbol}</i>
            {CELL[status].label}
          </span>
        ))}
      </div>
    </>
  );
}

export default PaymentGridPage;
