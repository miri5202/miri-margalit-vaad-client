import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDebtors } from "../api/summary";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { apartmentLabel, formatMoney, formatDate } from "../utils/format";
import { btn, cn, table, tableWrap, td, th } from "../utils/ui";
import type { Debtor } from "../types";

function residentEmails(d: Debtor): string[] {
  return d.residents.map((r) => r.email).filter((email): email is string => Boolean(email));
}

// קישור שפותח מייל תזכורת מוכן לכל הדיירים של הדירה
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
      <PageHeader title="חייבים" subtitle={`${debtors.length} דירות עם חוב פתוח · סה"כ ${formatMoney(totalDebt)}`} />

      {debtors.length === 0 ? (
        <EmptyState icon="🤝">אין חובות פתוחים - כולם שילמו!</EmptyState>
      ) : (
        <div className={tableWrap}>
          <table className={table}>
            <thead>
              <tr>
                <th className={th}>דירה</th>
                <th className={th}>דיירים</th>
                <th className={th}>חוב</th>
                <th className={th}>חיובים פתוחים</th>
                <th className={th}>באיחור</th>
                <th className={th}>חוב מתאריך</th>
                <th className={th}>תזכורת</th>
              </tr>
            </thead>
            <tbody>
              {debtors.map((d) => (
                <tr key={`${d.apartment}-${d.isUnit}`} className="hover:bg-soft">
                  <td className={cn(td, "whitespace-nowrap")}>
                    <strong>{apartmentLabel(d.apartment, d.isUnit)}</strong>
                    {d.partialCount > 0 && (
                      <span className="ms-2 inline-flex rounded-lg border-2 border-ink bg-half px-2 py-0.5 text-xs font-bold text-deep">
                        שולם חלקית
                      </span>
                    )}
                  </td>
                  <td className={td}>{d.residents.map((r) => r.fullName).join(", ") || "–"}</td>
                  <td className={cn(td, "num text-right font-bold whitespace-nowrap text-late-text dark:text-late")}>
                    {formatMoney(d.debt)}
                  </td>
                  <td className={cn(td, "num text-right")}>{d.openCount}</td>
                  <td className={cn(td, "num text-right")}>
                    {d.lateCount > 0 ? (
                      <span className="inline-grid size-7 place-items-center rounded-md border-2 border-ink bg-late font-bold text-deep">
                        {d.lateCount}
                      </span>
                    ) : (
                      0
                    )}
                  </td>
                  <td className={cn(td, "num text-right whitespace-nowrap")}>{formatDate(d.oldestDate)}</td>
                  <td className={td}>
                    {residentEmails(d).length > 0 ? (
                      <a className={btn("secondary", "sm")} href={reminderLink(d)}>
                        ✉️ שליחת תזכורת
                      </a>
                    ) : (
                      <span className="text-sm text-muted">אין אימייל</span>
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
