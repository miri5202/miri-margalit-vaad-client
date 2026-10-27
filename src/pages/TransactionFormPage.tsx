import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, getTransaction, updateTransaction } from "../api/transactions";
import type { TransactionInput } from "../types";
import TransactionForm from "../components/transactions/TransactionForm";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { getErrorMessage } from "../utils/errors";

function TransactionFormPage() {
  const { buildingId, txId } = useParams();
  const id = Number(buildingId);
  const isEdit = Boolean(txId); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading, isError } = useQuery({
    queryKey: ["transaction", id, txId],
    queryFn: () => getTransaction(id, Number(txId)),
    enabled: isEdit,
  });

  const saveMutation = useMutation({
    mutationFn: (data: TransactionInput) =>
      isEdit ? updateTransaction(id, Number(txId), data) : createTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      queryClient.invalidateQueries({ queryKey: ["summary", id] });
      navigate(`/buildings/${id}/transactions`); 
    },
  });

  if (isEdit && isLoading) return <Loader />;
  if (isEdit && (isError || !existing)) return <ErrorMessage message="התנועה לא נמצאה" />;

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <h1>{isEdit ? "עריכת תנועה" : "תנועה חדשה"}</h1>
      </div>

      <div className="card">
        <TransactionForm
          defaultValues={existing}
          onSubmit={(data) => saveMutation.mutate(data)}
          isSubmitting={saveMutation.isPending}
          serverError={saveMutation.error ? getErrorMessage(saveMutation.error) : undefined}
        />
      </div>
    </div>
  );
}

export default TransactionFormPage;
