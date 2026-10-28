export type Role = "admin" | "resident";
export type TransactionType = "income" | "expense";
export type Category =
  | "monthly_fee"
  | "cleaning"
  | "elevator"
  | "electricity"
  | "repairs"
  | "gardening"
  | "other";
export type PaymentMethod = "cash" | "transfer" | "check" | "credit";
export type Status = "paid" | "pending" | "late";

export interface User {
  id: number;
  fullName: string;
  email: string | null;
  role: Role;
  buildingId: number | null;
  apartment: number | null;
  phone: string | null;
  isUnit: boolean
}

export interface Building {
  id: number;
  name: string;
  address: string;
  city: string;
  apartmentsCount: number;
  monthlyFee: number;
  dueDay: number;
  joinCode?: string;
  unitFee: number;
  unitApartments: number[];
}

export interface Transaction {
  id: number;
  buildingId: number;
  type: TransactionType;
  amount: number;
  date: string;
  category: Category;
  apartment: number | null;
  supplier: string | null;
  paymentMethod: PaymentMethod;
  status: Status;
  description: string | null;
  isUnit: boolean;
  remainder?: Transaction;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface BuildingWithStats extends Building {
  residentsCount: number;
  balance: number;
  totalDebt: number;
}

export interface BuildingInput {
  name: string;
  address: string;
  city: string;
  apartmentsCount: number;
  monthlyFee: number;
  dueDay: number;
  unitFee?: number;
  unitApartments?: number[] | string;
}

export type TransactionInput = Omit<Transaction, "id" | "buildingId">;

export interface TransactionFilters {
  type?: TransactionType;
  category?: Category;
  status?: Status;
  paymentMethod?: PaymentMethod;
  apartment?: number;
  month?: string;
  search?: string;
  sortBy?: "date" | "amount" | "createdAt" | "apartment" | "category" | "status";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface Summary {
  building: { id: number; name: string };
  balance: number;
  totalIncome: number;
  totalExpense: number;
  thisMonth: { income: number; expense: number };
  expensesByCategory: { category: Category; total: number }[];
  totalDebt?: number;
  myDebt?: number;
}

export type PaymentCellStatus = Status | "none" | "partial";export interface PaymentsGrid {
  year: number;
  rows: { apartment: number; isUnit:boolean; residents: string[]; months: PaymentCellStatus[] }[];
}

export interface Debtor {
  apartment: number;
  debt: number;
  openCount: number;
  lateCount: number;
  oldestDate: string;
  residents: { fullName: string; phone: string | null; email: string | null }[];
  isUnit: boolean;
}

export interface ResidentInput {
  fullName: string;
  email?: string;
  password?: string;
  apartment: number;
  phone?: string;
  isUnit?: boolean;
}

export interface ChargeResult {
  month: string;
  amount: number;
  created: number;
  skipped: number;
}