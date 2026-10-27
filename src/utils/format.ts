
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return date.split("-").reverse().join("/");
}

export function apartmentLabel(apartment: number | null, isUnit = false): string {
  if (apartment === null) return "";
  return isUnit ? `יחידה ${apartment}א` : `דירה ${apartment}`;
}