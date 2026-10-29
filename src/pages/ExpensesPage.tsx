import { useState } from "react";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/transactions";
import type { TransactionFilters } from "../types";
import TransactionsTable from "../components/transactions/TransactionsTable";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/ui/PageHeader";

function ExpensesPage() {
  const { buildingId } = useParams();
  const id = Number(buildingId);
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses", id, filters],
    queryFn: () => getExpenses(id, filters),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorMessage message="לא הצלחנו לטעון את ההוצאות" />;

  return (
    <>
      <PageHeader title="הוצאות הבניין" subtitle="לאן הולך הכסף של הוועד" />

      <TransactionsTable transactions={data.items} />

      <Pagination
        page={data.page}
        pages={data.pages}
        onChange={(newPage) => setFilters({ ...filters, page: newPage })}
      />
    </>
  );
}

export default ExpensesPage;
