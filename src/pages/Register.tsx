import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../api/authService";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Hasła nie są takie same");
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        firstName,
        lastName,
        newPassword: password,
        repeatNewPassword: repeatPassword,
      });
      navigate("/login"); // po rejestracji idzie do logowania
    } catch {
      setError("Rejestracja nie powiodła się. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Rejestracja</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Imię"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nazwisko"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Hasło"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Powtórz hasło"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>
        </form>

        <p>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
