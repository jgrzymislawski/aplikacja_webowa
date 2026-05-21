import client from "./client";

export type CreateExpenseRequest = {
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  participants: { userId: string }[]

};


export const createExpense = async (expenseData: CreateExpenseRequest) => {
  const res = await client.post("/expenses", expenseData);
  return res.data;
};

export const getMyExpenses = async () => {
  const res = await client.get("/expenses");
  return res.data;
};
export const deleteExpense = async (id: string) => {
  return client.delete(`/expenses/${id}`);
};
export const payMyPart = async (expenseId: string) => {
  return client.patch(`/expenses/${expenseId}/pay`);
};
export const getExpenseDetails = async (id: string) => {
  const res = await client.get(`/expenses/${id}`);
  return res.data;
};

