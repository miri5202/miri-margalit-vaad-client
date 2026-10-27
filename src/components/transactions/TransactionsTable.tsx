import { Link } from "react-router-dom";
import type { Transaction } from "../../types";
import { categoryLabels, typeLabels } from "../../utils/labels";
import { apartmentLabel, formatDate, formatMoney } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";

interface TransactionsTableProps {
  transactions: Transaction[];
  onMarkPaid?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  editPath?: (transaction: Transaction) => string;
  receiptPath?: (transaction: Transaction) => string;
}

function TransactionsTable({ transactions, onMarkPaid, onDelete, editPath, receiptPath }: TransactionsTableProps) {
  const showActions = Boolean(onMarkPaid || onDelete || editPath || receiptPath);

  if (transactions.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-state__icon">📭</div>
        לא נמצאו תנועות
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>תאריך</th>
            <th>סוג</th>
            <th>קטגוריה</th>
            <th>דירה / ספק</th>
            <th>סכום</th>
            <th>סטטוס</th>
            <th>תיאור</th>
            {showActions && <th></th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="num">{formatDate(t.date)}</td>
              <td>
                <span className={`badge badge--${t.type}`}>{typeLabels[t.type]}</span>
              </td>
              <td>{categoryLabels[t.category]}</td>
              <td>{t.type === "income" ? apartmentLabel(t.apartment, t.isUnit) : t.supplier}</td>
              <td className={`amount amount--${t.type}`}>{formatMoney(t.amount)}</td>
              <td>
                <StatusBadge status={t.status} />
              </td>
              <td>{t.description}</td>

              {showActions && (
                <td className="actions">
                  {receiptPath && t.type === "income" && t.status === "paid" && (
                    <Link className="btn btn--sm btn--secondary" to={receiptPath(t)}>
                      🧾 קבלה
                    </Link>
                  )}
                  {onMarkPaid && t.type === "income" && t.status !== "paid" && (
                    <button className="btn btn--sm btn--accent" onClick={() => onMarkPaid(t)}>
                      סמן כשולם
                    </button>
                  )}
                  {editPath && (
                    <Link className="btn btn--sm btn--secondary" to={editPath(t)}>
                      עריכה
                    </Link>
                  )}
                  {onDelete && (
                    <button className="btn btn--sm btn--danger" onClick={() => onDelete(t)}>
                      מחיקה
                    </button>
                  )}
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