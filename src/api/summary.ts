import api from "./client";
import type { Summary, PaymentsGrid, Debtor } from "../types";

export async function getSummary(buildingId: number): Promise<Summary> {
   const response = await api.get<Summary>(`/buildings/${buildingId}/summary`);
   return response.data;
}

export async function getPaymentsGrid(buildingId: number, year: number): Promise<PaymentsGrid> {
   const response = await api.get<PaymentsGrid>(`/buildings/${buildingId}/summary/payments-grid`, {params: {year}});
   return response.data;
}
export async function getDebtors(buildingId: number): Promise<Debtor[]> {
   const response = await api.get<Debtor[]>(`/buildings/${buildingId}/summary/debtors`);
   return response.data;
}