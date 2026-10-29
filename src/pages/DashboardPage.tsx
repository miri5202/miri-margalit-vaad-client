import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSummary, getPaymentsGrid } from "../api/summary";
import { getBuilding } from "../api/buildings";
import { getAnnouncements } from "../api/announcements";
import { useAuth } from "../context/AuthContext";
import SummaryCard from "../components/common/SummaryCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ExpenseChart from "../components/common/ExpenseChart";
import AnnouncementsBoard from "../components/common/AnnouncementsBoard";
import BuildingWindows, { WindowsLegend } from "../components/ui/BuildingWindows";
import type { WindowInfo } from "../components/ui/BuildingWindows";
import PageHeader from "../components/ui/PageHeader";
import { card } from "../utils/ui";

const MONTH_NAMES = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

function DashboardPage() {
  const { buildingId } = useParams();
  const id = Number(buildingId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = ינואר

  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ["summary", id],
    queryFn: () => getSummary(id),
  });

  // ועד: מי שילם החודש (אותם נתונים כמו בעמוד "מי שילם")
  const { data: grid } = useQuery({
    queryKey: ["payments-grid", id, year],
    queryFn: () => getPaymentsGrid(id, year),
    enabled: isAdmin,
  });

  // דייר: פרטי הבניין (כמה דירות), כדי לצייר את הבניין ולסמן את הדירה שלו
  const { data: building } = useQuery({
    queryKey: ["building", id],
    queryFn: () => getBuilding(id),
    enabled: !isAdmin,
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => getAnnouncements(id),
  });

  if (isLoading) return <Loader />;
  if (isError || !summary) return <ErrorMessage message="לא הצלחנו לטעון את הבניין" />;

  // החלונות של הבניין באיור
  let windows: WindowInfo[] = [];
  if (isAdmin && grid) {
    windows = grid.rows.map((row) => ({
      apartment: row.apartment,
      isUnit: row.isUnit,
      residents: row.residents,
      status: row.months[month],
    }));
  } else if (!isAdmin && building) {
    const apartments = Array.from({ length: building.apartmentsCount }, (_, i) => i + 1);
    windows = [
      ...apartments.map((apt) => ({ apartment: apt, isUnit: false, residents: [], status: "none" as const })),
      ...building.unitApartments.map((apt) => ({ apartment: apt, isUnit: true, residents: [], status: "none" as const })),
    ].map((w) => {
      const isMine = w.apartment === user?.apartment && w.isUnit === user?.isUnit;
      return isMine ? { ...w, highlight: true } : w;
    });
  }

  const paidCount = windows.filter((w) => w.status === "paid").length;
  const chargedCount = windows.filter((w) => w.status !== "none").length;

  return (
    <>
      <PageHeader title={summary.building.name} subtitle={`${MONTH_NAMES[month]} ${year} · מצב הקופה של הבניין`} />

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* הבניין: כל חלון הוא דירה */}
        <section className="rounded-3xl border-[2.5px] border-ink bg-sky-fade p-5 sm:p-6">
          <h2 className="text-2xl">{isAdmin ? "מי שילם החודש?" : "הבניין שלנו"}</h2>
          <p className="mb-3 text-sm text-muted">
            {isAdmin
              ? `${paidCount} מתוך ${chargedCount} שילמו. מעבר עם העכבר על חלון מראה את הפרטים, ולחיצה פותחת את טבלת "מי שילם".`
              : "הדירה שלך מסומנת בחלון המודגש."}
          </p>
          {windows.length > 0 ? (
            <BuildingWindows
              windows={windows}
              onSelect={isAdmin ? () => navigate(`/buildings/${id}/payments`) : undefined}
            />
          ) : (
            <Loader />
          )}
          {isAdmin && <WindowsLegend />}
        </section>

        <div className="grid min-w-0 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard label="יתרה בקופה" value={summary.balance} variant="highlight" />
            <SummaryCard label="נכנס החודש" value={summary.thisMonth.income} variant="income" />
            <SummaryCard label="יצא החודש" value={summary.thisMonth.expense} variant="expense" />
            <SummaryCard
              label={isAdmin ? "חובות פתוחים" : "החוב שלי"}
              value={(isAdmin ? summary.totalDebt : summary.myDebt) ?? 0}
              variant="debt"
            />
          </div>

          <section className={card}>
            <h2 className="mb-3 text-2xl">לאן הלך הכסף?</h2>
            <ExpenseChart data={summary.expensesByCategory} />
          </section>
        </div>
      </div>

      {announcements && (
        <div className="mt-8">
          <AnnouncementsBoard buildingId={id} announcements={announcements} canEdit={isAdmin} />
        </div>
      )}
    </>
  );
}

export default DashboardPage;
