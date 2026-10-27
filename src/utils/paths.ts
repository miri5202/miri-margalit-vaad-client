import type { User } from "../types";

export function homePath(user: User): string {
  if (user.role === "admin") return "/buildings";
  return `/buildings/${user.buildingId}`;
}
