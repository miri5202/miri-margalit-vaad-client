import { useState } from "react";
import { Link } from "react-router-dom";
import type { Transaction } from "../../types";
import { categoryLabels } from "../../utils/labels";
import { apartmentLabel, formatDate, formatMoney } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { btn, cn, input, table, tableWrap, td, th } from "../../utils/ui";

interface TransactionsTableProps {
  transactions: Transaction[];
  onMarkPaid?: (transaction: Transaction) => void;
  onPartialPay?: (transaction: Transaction, amount: number) => void;
  onDelete?: (transaction: Transaction) => void;
  editPath?: (transaction: Transaction) => string;
  receiptPath?: (transaction: Transaction) => string;
}

function TransactionsTable({
  transactions,
  onMarkPaid,
  onPartialPay,
  onDelete,
  editPath,
  receiptPath,
}: TransactionsTableProps) {
  const [partialId, setPartialId] = useState<number | null>(null);
  const [partialAmount, setPartialAmount] = useState("");

  const showActions = Boolean(onMarkPaid || onPartialPay || onDelete || editPath || receiptPath);

  if (transactions.length === 0) {
    return <EmptyState icon="📭">לא נמצאו תנועות</EmptyState>;
  }

  return (
    <div className={tableWrap}>
      <table className={table}>
        <thead>
          <tr>
            <th className={th}>תאריך</th>
            <th className={th}>סוג</th>
            <th className={th}>קטגוריה</th>
            <th className={th}>דירה / ספק</th>
            <th className={th}>סכום</th>
            <th className={th}>סטטוס</th>
            <th className={th}>תיאור</th>
            {showActions && <th className={th}></th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-soft">
              <td className={cn(td, "num text-right whitespace-nowrap")}>{formatDate(t.date)}</td>
              <td className={td}>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold whitespace-nowrap text-deep",
                    t.type === "income" ? "bg-sun/60" : "bg-blush"
                  )}
                >
                  {t.type === "income" ? "↓ הכנסה" : "↑ הוצאה"}
                </span>
              </td>
              <td className={cn(td, "whitespace-nowrap")}>{categoryLabels[t.category]}</td>
              <td className={cn(td, "whitespace-nowrap")}>
                {t.type === "income" ? apartmentLabel(t.apartment, t.isUnit) : t.supplier}
              </td>
              <td
                className={cn(
                  td,
                  "num text-right font-bold whitespace-nowrap",
                  t.type === "income" ? "text-paid-text dark:text-mint" : "text-late-text dark:text-late"
                )}
              >
                {formatMoney(t.amount)}
              </td>
              <td className={td}>
                <StatusBadge status={t.status} />
              </td>
              <td className={cn(td, "min-w-40 text-muted")}>{t.description}</td>

              {showActions && (
                <td className={td}>
                  <div className="flex flex-nowrap items-center gap-2">
                    {receiptPath && t.type === "income" && t.status === "paid" && (
                      <Link className={btn("secondary", "sm")} to={receiptPath(t)}>
                        🧾 קבלה
                      </Link>
                    )}
                    {onMarkPaid && t.type === "income" && t.status !== "paid" && partialId !== t.id && (
                      <button className={btn("accent", "sm")} onClick={() => onMarkPaid(t)}>
                        סמן כשולם
                      </button>
                    )}
                    {onPartialPay &&
                      t.type === "income" &&
                      t.status !== "paid" &&
                      (partialId === t.id ? (
                        <span className="inline-flex items-center gap-2">
                          <input
                            className={cn(input(), "w-24 py-1.5 text-sm")}
                            type="number"
                            placeholder="סכום"
                            aria-label="הסכום ששולם"
                            autoFocus
                            value={partialAmount}
                            onChange={(e) => setPartialAmount(e.target.value)}
                          />
                          <button
                            className={btn("accent", "sm")}
                            disabled={!(Number(partialAmount) > 0 && Number(partialAmount) < t.amount)}
                            onClick={() => {
                              onPartialPay(t, Number(partialAmount));
                              setPartialId(null);
                            }}
                          >
                            אישור
                          </button>
                          <button className={btn("ghost", "sm")} onClick={() => setPartialId(null)}>
                            ביטול
                          </button>
                        </span>
                      ) : (
                        <button
                          className={btn("secondary", "sm")}
                          onClick={() => {
                            setPartialId(t.id);
                            setPartialAmount("");
                          }}
                        >
                          תשלום חלקי
                        </button>
                      ))}
                    {editPath && (
                      <Link className={btn("secondary", "sm")} to={editPath(t)}>
                        עריכה
                      </Link>
                    )}
                    {onDelete && (
                      <button className={btn("danger", "sm")} onClick={() => onDelete(t)}>
                        מחיקה
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
