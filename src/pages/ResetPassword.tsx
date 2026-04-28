import { useState } from "react";
import "./Auth.css";

export default function ResetPassword() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Instrukcje do resetowania hasła zostały wysłane na maila!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Odzyskaj hasło</h2>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Wprowadź adres email" required />
          <button type="submit">Wyślij</button>
        </form>
      </div>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}
