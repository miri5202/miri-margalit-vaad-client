import api from "./client";
import type { Announcement } from "../types";

// לוח המודעות של הבניין (כל דיירי הבניין רואים)
export async function getAnnouncements(buildingId: number): Promise<Announcement[]> {
  const response = await api.get<Announcement[]>(`/buildings/${buildingId}/announcements`);
  return response.data;
}
