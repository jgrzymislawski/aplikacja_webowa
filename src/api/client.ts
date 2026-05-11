import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// INTERCEPTOR REQUESTU
// Przed każdym wysłaniem requestu – dodaj token do nagłówka
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR RESPONSU
// Po każdej odpowiedzi – jeśli serwer zwróci błąd 401 (brak dostępu),
// spróbuj odświeżyć token i ponów request
client.interceptors.response.use(
  (response) => response, // jeśli OK – zwróć normalnie
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // zabezpieczenie przed nieskończoną pętlą

      try {
        // poproś API o nowy token (używa refreshToken z cookie)
        const res = await client.post("/auth/refresh");
        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return client(original); // ponów oryginalny request z nowym tokenem
      } catch {
        // jeśli refresh też nie zadziałał – wyloguj użytkownika
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default client;
