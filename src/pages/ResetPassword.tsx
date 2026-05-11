import { useState } from "react";
import "./Auth.css";
import client from "../api/client";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await client.post("/auth/reset-password", { email });
      setMessage("Instrukcje do resetowania hasła zostały wysłane na maila!");
      setEmail("");
    } catch {
      setError("Nie udało się wysłać emaila. Sprawdź czy adres jest poprawny.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Odzyskaj hasło</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Wprowadź adres email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </button>
        </form>
      </div>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}
