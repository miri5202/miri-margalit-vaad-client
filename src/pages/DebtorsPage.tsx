import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDebtors } from "../api/summary";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { apartmentLabel, formatMoney, formatDate } from "../utils/format";
import type { Debtor } from "../types";

function residentEmails(d: Debtor): string[] {
    return d.residents.map((r) => r.email).filter((email): email is string => Boolean(email));
}

function reminderLink(d: Debtor): string {
    const emails = residentEmails(d).join(",");

    const subject = `תזכורת: דמי ועד - ${apartmentLabel(d.apartment, d.isUnit)}`;
    const body =
        `שלום,\n` +
        `זוהי תזכורת ידידותית שקיים חוב פתוח של ${formatMoney(d.debt)} לוועד הבית.\n` +
        `נודה להסדרת התשלום בהקדם.\n` +
        `תודה, ועד הבית`;

    return `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function DebtorsPage() {
    const { buildingId } = useParams();
    const id = Number(buildingId);

    const { data: debtors, isLoading, isError } = useQuery({
        queryKey: ["debtors", id],
        queryFn: () => getDebtors(id),
    });

    if (isLoading) return <Loader />;
    if (isError || !debtors) return <ErrorMessage message="לא הצלחנו לטעון את העמוד" />;
    const totalDebt = debtors.reduce((sum, d) => sum + d.debt, 0);

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>חייבים</h1>
                    <p>
                        {debtors.length} דירות עם חוב פתוח · סה"כ {formatMoney(totalDebt)}
                    </p>
                </div>
            </div>

            {debtors.length === 0 && (
                <div className="card empty-state">
                    <div className="empty-state__icon">🤝</div>
                    אין חובות פתוחים - כולם שילמו!
                </div>
            )}

            {debtors.length > 0 && (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>דירה</th>
                                <th>דיירים</th>
                                <th>חוב</th>
                                <th>חיובים פתוחים</th>
                                <th>באיחור</th>
                                <th>חוב מתאריך</th>
                                <th>תזכורת</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debtors.map((d) => (
                                <tr key={`${d.apartment}-${d.isUnit}`}>
                                    <td><strong>{apartmentLabel(d.apartment, d.isUnit)}</strong></td>
                                    <td>{d.residents.map((r) => r.fullName).join(", ")}</td>
                                    <td className="amount amount--expense">{formatMoney(d.debt)}</td>
                                    <td className="num">{d.openCount}</td>
                                    <td className="num">{d.lateCount}</td>
                                    <td className="num">{formatDate(d.oldestDate)}</td>
                                    <td>
                                        {residentEmails(d).length > 0 ? (
                                            <a className="btn btn--sm btn--secondary" href={reminderLink(d)}>
                                                ✉️ שליחת תזכורת
                                            </a>
                                        ) : (
                                            <span style={{ color: "var(--text-muted)" }}>אין אימייל</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default DebtorsPage;