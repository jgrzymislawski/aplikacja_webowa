import client from "./client";

export const getNotifications = async () => {
  const res = await client.get("/notifications");
  return res.data;
};

export const markAsRead = async (id: string) => {
  await client.patch(`/notifications/${id}/read`);
};
