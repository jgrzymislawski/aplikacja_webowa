import client from "./client";

export const login = async (email: string, password: string) => {
  const res = await client.post("/auth/login", { email, password });
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data;
};

export const register = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  newPassword: string;
  repeatNewPassword: string;
}) => {
  return client.post("/auth/register", data);
};

export const logout = async () => {
  await client.post("/auth/logout");
  localStorage.removeItem("accessToken");
};

export const loginWithOAuth = (provider: "google") => {
  window.location.href = `http://localhost:8080/api/oauth2/authorization/${provider}`;
};

export const verify2FA = async (code: string) => {
  const res = await client.post("/auth/2fa/verify", { code });
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data;
};
