import api from "./client";
import type { ChargeResult } from "../types";

export async function createCharges(
  buildingId: number,
  month: string,
  amount?: number
): Promise<ChargeResult> {
  const response = await api.post<ChargeResult>(`/buildings/${buildingId}/charges`, {
    month,
    amount,
  });
  return response.data;
}