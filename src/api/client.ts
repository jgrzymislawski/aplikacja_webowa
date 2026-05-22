import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await client.post("/auth/refresh");
        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return client(original);
      } catch {
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
