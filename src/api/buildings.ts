import api from "./client";
import type { Building, BuildingWithStats, BuildingInput } from "../types";

export async function getBuildings(): Promise<BuildingWithStats[]> {
  const response = await api.get<BuildingWithStats[]>("/buildings");
  return response.data;
}

export async function getBuilding(id: number): Promise<Building> {
  const response = await api.get<Building>(`/buildings/${id}`);
  return response.data;
}

export async function createBuilding(data: BuildingInput): Promise<BuildingWithStats> {
  const response = await api.post<BuildingWithStats>("/buildings", data);
  return response.data;
}

export async function updateBuilding(id: number, data: BuildingInput): Promise<BuildingWithStats> {
  const response = await api.put<BuildingWithStats>(`/buildings/${id}`, data);
  return response.data;
}

export async function deleteBuilding(id: number): Promise<void> {
  await api.delete(`/buildings/${id}`);
}