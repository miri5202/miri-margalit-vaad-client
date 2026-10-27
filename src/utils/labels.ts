import type { Status, TransactionType, Category, PaymentMethod } from "../types";


export const statusLabels: Record<Status, string> = {
  paid: "שולם",
  pending: "ממתין",
  late: "באיחור",
};

export const typeLabels: Record<TransactionType, string> = {
  income: "הכנסה",
  expense: "הוצאה",
};

export const categoryLabels: Record<Category, string> = {
  monthly_fee: "דמי ועד",
  cleaning: "ניקיון",
  elevator: "מעלית",
  electricity: "חשמל",
  repairs: "תיקונים",
  gardening: "גינון",
  other: "אחר",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "מזומן",
  transfer: "העברה",
  check: "צ'ק",
  credit: "אשראי",
};