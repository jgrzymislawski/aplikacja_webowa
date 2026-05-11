import client from "./client";

export const getProfile = async () => {
  const res = await client.get("/profile");
  return res.data;
};

export const updateProfile = async (data: {
  firstName: string;
  lastName: string;
}) => {
  const res = await client.patch("/profile", data);
  return res.data;
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}) => {
  const res = await client.patch("/profile/password", data);
  return res.data;
};

export const deleteAccount = async () => {
  await client.delete("/profile");
};

export const getFriends = async () => {
  const res = await client.get("/profile/friends");
  return res.data;
};

export const enable2FA = async () => {
  const res = await client.post("/profile/2fa/enable", null, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data);
  return url;
};

export const confirm2FA = async (code: string) => {
  await client.post("/profile/2fa/confirm", { code });
};

export const disable2FA = async () => {
  await client.post("/profile/2fa/disable");
};
