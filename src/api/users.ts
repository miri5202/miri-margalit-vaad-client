import api from "./client";
import type { User, ResidentInput } from "../types";

export async function getResidents(buildingId: number): Promise<User[]> {
  const response = await api.get<User[]>(`/buildings/${buildingId}/users`);
  return response.data;
}

export async function createResident(buildingId: number, data: ResidentInput): Promise<User> {
  const response = await api.post<User>(`/buildings/${buildingId}/users`, data);
  return response.data;
}

export async function updateResident(
  buildingId: number,
  id: number,
  data: ResidentInput
): Promise<User> {
  const response = await api.put<User>(`/buildings/${buildingId}/users/${id}`, data);
  return response.data;
}

export async function deleteResident(buildingId: number, id: number): Promise<void> {
  await api.delete(`/buildings/${buildingId}/users/${id}`);
}