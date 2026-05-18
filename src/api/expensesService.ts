import client from "./client";

export type CreateExpenseRequest = {
  title: string;
  description?: string;
  amount: number;
  participants: { userId: string }[];
  expenseDate: string;
};

export const createExpense = async (expenseData: CreateExpenseRequest) => {
  const res = await client.post("/expenses", expenseData);
  return res.data;
};

export const getMyExpenses = async () => {
  const res = await client.get("/expenses");
  return res.data;
};
