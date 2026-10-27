import { Link, useParams } from "react-router-dom";
import TransactionsTable from "../components/transactions/TransactionsTable";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { useState } from "react";
import Pagination from "../components/common/Pagination";
import Filters from "../components/transactions/Filters";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, getTransactions, markAsPaid } from "../api/transactions";
import type { Transaction, TransactionFilters } from "../types";
import { downloadCsv } from "../utils/csv";
import { apartmentLabel, formatDate } from "../utils/format";
import { categoryLabels, paymentMethodLabels, statusLabels, typeLabels } from "../utils/labels";

function TransactionsPage() {
  const { buildingId } = useParams();
  const id = Number(buildingId);
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1 });
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions", id, filters],
    queryFn: () => getTransactions(id, filters),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["transactions", id] });
    queryClient.invalidateQueries({ queryKey: ["summary", id] });
  }

  const payMutation = useMutation({
    mutationFn: (t: Transaction) => markAsPaid(id, t.id),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: (t: Transaction) => deleteTransaction(id, t.id),
    onSuccess: refresh,
  });

  function handleDelete(t: Transaction) {
    if (window.confirm("למחוק את התנועה?")) {
      deleteMutation.mutate(t);
    }
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const all: Transaction[] = [];
      let page = 1;
      let pages = 1;
      do {
        const result = await getTransactions(id, { ...filters, page, limit: 100 });
        all.push(...result.items);
        pages = result.page;
        page++;
      } while (page <= pages);

      const rows = [
        ["תאריך", "סוג", "קטגוריה", "דירה / ספק", "סכום", "אמצעי תשלום", "סטטוס", "תיאור"],
        ...all.map((t) => [
          formatDate(t.date),
          typeLabels[t.type],
          categoryLabels[t.category],
          t.type === "income" ? apartmentLabel(t.apartment, t.isUnit) : t.supplier ?? "",
          t.amount,
          paymentMethodLabels[t.paymentMethod],
          statusLabels[t.status],
          t.description ?? "",
        ]),
      ];
      downloadCsv(`תנועות-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorMessage message="לא הצלחנו להתחבר לתנועות בבניין" />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>תנועות</h1>
          <p>סה"כ {data.total} תנועות</p>
        </div>
        <button className="btn btn--secondary" onClick={handleExport} disabled={isExporting}>
          {isExporting ? "מייצא..." : "📥 ייצוא"}
        </button>
        <Link className="btn btn--accent" to={`/buildings/${id}/transactions/new`}>
          + תנועה חדשה
        </Link>
      </div>

      <Filters filters={filters} onChange={setFilters} />

      <TransactionsTable
        transactions={data.items}
        onMarkPaid={(t) => payMutation.mutate(t)}
        onDelete={handleDelete}
        editPath={(t) => `/buildings/${id}/transactions/${t.id}/edit`}
      />
      <Pagination
        page={data.page}
        pages={data.pages}
        onChange={(newPage) => setFilters({ ...filters, page: newPage })}
      />
    </>
  );
}

export default TransactionsPage;