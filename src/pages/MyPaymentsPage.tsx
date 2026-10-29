import { useState } from "react";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMyPayments } from "../api/transactions";
import type { TransactionFilters } from "../types";
import TransactionsTable from "../components/transactions/TransactionsTable";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/ui/PageHeader";

function MyPaymentsPage() {
  const { buildingId } = useParams();
  const id = Number(buildingId);
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-payments", id, filters],
    queryFn: () => getMyPayments(id, filters),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorMessage message="לא הצלחנו לטעון את התשלומים" />;

  return (
    <>
      <PageHeader title="התשלומים שלי" subtitle="כל החיובים של הדירה שלך" />

      <TransactionsTable
        transactions={data.items}
        receiptPath={(t) => `/buildings/${id}/transactions/${t.id}/receipt`}
      />

      <Pagination
        page={data.page}
        pages={data.pages}
        onChange={(newPage) => setFilters({ ...filters, page: newPage })}
      />
    </>
  );
}

export default MyPaymentsPage;
