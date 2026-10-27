import api from "./client";
import type {
  Transaction,
  TransactionInput,
  TransactionFilters,
  ListResponse,
  PaymentMethod,
} from "../types";

export async function getTransactions(
  buildingId: number,
  filters: TransactionFilters
): Promise<ListResponse<Transaction>> {
  const response = await api.get<ListResponse<Transaction>>(
    `/buildings/${buildingId}/transactions`,
    { params: filters }
  );
  return response.data;
}

export async function getMyPayments(
  buildingId: number,
  filters: TransactionFilters
): Promise<ListResponse<Transaction>> {
  const response = await api.get<ListResponse<Transaction>>(
    `/buildings/${buildingId}/transactions/mine`,
    { params: filters }
  );
  return response.data;
}

export async function getExpenses(
  buildingId: number,
  filters: TransactionFilters
): Promise<ListResponse<Transaction>> {
  const response = await api.get<ListResponse<Transaction>>(
    `/buildings/${buildingId}/transactions/expenses`,
    { params: filters }
  );
  return response.data;
}

export async function getTransaction(buildingId: number, id: number): Promise<Transaction> {
  const response = await api.get<Transaction>(`/buildings/${buildingId}/transactions/${id}`);
  return response.data;
}

export async function createTransaction(
  buildingId: number,
  data: TransactionInput
): Promise<Transaction> {
  const response = await api.post<Transaction>(`/buildings/${buildingId}/transactions`, data);
  return response.data;
}

export async function updateTransaction(
  buildingId: number,
  id: number,
  data: TransactionInput
): Promise<Transaction> {
  const response = await api.put<Transaction>(
    `/buildings/${buildingId}/transactions/${id}`,
    data
  );
  return response.data;
}

export async function deleteTransaction(buildingId: number, id: number): Promise<void> {
  await api.delete(`/buildings/${buildingId}/transactions/${id}`);
}

export async function markAsPaid(
  buildingId: number,
  id: number,
  paymentMethod?: PaymentMethod
): Promise<Transaction> {
  const response = await api.patch<Transaction>(
    `/buildings/${buildingId}/transactions/${id}/pay`,
    { paymentMethod }
  );
  return response.data;
}