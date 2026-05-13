import client from "./client";

export const getFriends = async (status = "ACCEPTED") => {
  const res = await client.get("/friendships", {
    params: { status },
  });
  return res.data.content;
};

export const addFriend = async (recipientId: string) => {
  const res = await client.post("/friendships", { recipientId });
  return res.data;
};

export const removeFriendApi = async (id: string) => {
  const res = await client.delete(`/friendships/${id}`);
  return res.data;
};
export const acceptFriend = async (id: string) => {
  const res = await client.patch(`/friendships/${id}/accept`);
  return res.data;
};

export const rejectFriend = async (id: string) => {
  const res = await client.patch(`/friendships/${id}/reject`);
  return res.data;
};
