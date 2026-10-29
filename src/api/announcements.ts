import api from "./client";
import type { Announcement, AnnouncementInput } from "../types";

// לוח המודעות של הבניין (כל דיירי הבניין רואים)
export async function getAnnouncements(buildingId: number): Promise<Announcement[]> {
  const response = await api.get<Announcement[]>(`/buildings/${buildingId}/announcements`);
  return response.data;
}

// הוספה, עריכה ומחיקה - לוועד בלבד
export async function createAnnouncement(buildingId: number, data: AnnouncementInput): Promise<Announcement> {
  const response = await api.post<Announcement>(`/buildings/${buildingId}/announcements`, data);
  return response.data;
}

export async function updateAnnouncement(
  buildingId: number,
  id: number,
  data: Partial<AnnouncementInput>
): Promise<Announcement> {
  const response = await api.put<Announcement>(`/buildings/${buildingId}/announcements/${id}`, data);
  return response.data;
}

export async function deleteAnnouncement(buildingId: number, id: number): Promise<void> {
  await api.delete(`/buildings/${buildingId}/announcements/${id}`);
}
