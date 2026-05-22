import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { loginWithOAuth } from "../api/authService";

export default function Login() {
  const { handleLogin, handleVerifyTwoFactor } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await handleLogin(email, password);
      if (data?.twoFactorRequired) {
        setTwoFactorRequired(true);
      } else {
        navigate("/main");
      }
    } catch {
      setError("Nieprawidłowy email lub hasło");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await handleVerifyTwoFactor(twoFaCode);
      navigate("/main");
    } catch {
      setError("Nieprawidłowy kod 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!twoFactorRequired ? (
          <>
            <h2>Zaloguj się</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                name="password"
                placeholder="Hasło"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
              )}
              <button type="submit" disabled={loading}>
                {loading ? "Logowanie..." : "Zaloguj się"}
              </button>
            </form>

            <button
              className="google-btn"
              onClick={() => loginWithOAuth("google")}
            >
              <FcGoogle size={24} />
              <span>Zaloguj przez Google</span>
            </button>

            <p>
              Nie masz konta? <Link to="/register"> Zarejestruj się</Link>
            </p>
            <p>
              <Link to="/resetpassword">Nie pamiętam hasła</Link>
            </p>
          </>
        ) : (
          <>
            <h2>Weryfikacja 2FA</h2>
            <p style={{ fontSize: "14px", marginBottom: "12px" }}>
              Wpisz kod z aplikacji Google Authenticator
            </p>
            <form onSubmit={handleVerify2FA}>
              <input
                type="text"
                placeholder="Kod 6-cyfrowy"
                required
                maxLength={6}
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e.target.value)}
              />
              {error && (
                <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
              )}
              <button type="submit" disabled={loading}>
                {loading ? "Weryfikacja..." : "Zatwierdź"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
