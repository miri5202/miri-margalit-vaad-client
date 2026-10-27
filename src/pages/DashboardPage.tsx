import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../api/summary";
import SummaryCard from "../components/common/SummaryCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ExpenseChart from "../components/common/ExpenseChart";

function DashboardPage() {
  const { buildingId } = useParams();
  const id = Number(buildingId);

  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ["summary", id],
    queryFn: () => getSummary(id),
  });

  if (isLoading) return <Loader />;
  if (isError || !summary) return <ErrorMessage message="לא הצלחנו לטעון את הבניין" />;

  const isAdminView = summary.totalDebt !== undefined;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{summary.building.name}</h1>
          <p>מצב הקופה של הבניין</p>
        </div>
      </div>

      <div className="card-grid">
        <SummaryCard label="יתרה בקופה" value={summary.balance} variant="highlight" />
        <SummaryCard label="הכנסות החודש" value={summary.thisMonth.income} variant="income" />
        <SummaryCard label="הוצאות החודש" value={summary.thisMonth.expense} variant="expense" />
        <SummaryCard
          label={isAdminView ? "חובות פתוחים" : "החוב שלי"}
          value={(isAdminView ? summary.totalDebt : summary.myDebt) ?? 0}
          variant="debt"
        />
      </div>
      <div className="card section">
        <h2>הוצאות לפי קטגוריה</h2>
        <ExpenseChart data={summary.expensesByCategory} />
      </div>
    </>
  );
}

export default DashboardPage;