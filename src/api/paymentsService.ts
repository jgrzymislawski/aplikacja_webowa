import client from "./client";

export const getPayments = async () => {
  const res = await client.get("/profile/payments");
  return res.data;
};

