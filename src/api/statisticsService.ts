import client from "../api/client";

export const getPaymentStatistics = async (from: string, to: string) => {
  const res = await client.get("/statistics/payments", {
    params: { from, to },
  });
  return res.data;
};

export const getExpenseStatistics = async (from: string, to: string) => {
  const res = await client.get("/statistics/expenses", {
    params: { from, to },
  });
  return res.data;
};
