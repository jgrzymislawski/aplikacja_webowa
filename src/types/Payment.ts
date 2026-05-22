import type { Expense } from "./Expense";

export type Payment = {
  id: string;
  payer: {
    id: string;
    email: string;
    name?: string;
  };
  expense: Expense;
  createdAt: string;
  updatedAt: string;
};
