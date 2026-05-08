import "./Auth.css";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const handleGoogleLogin = () => {
    alert("Logowanie Google");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Zaloguj się</h2>

        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Hasło" required />

          <button type="submit">Zaloguj się</button>
        </form>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <FcGoogle size={24} />
          <span>Zaloguj przez Google</span>
        </button>

        <p>
          Nie masz konta?
          <Link to="/register"> Zarejestruj się</Link>
        </p>

        <p>
          <Link to="/resetpassword">Nie pamiętam hasła</Link>
        </p>
      </div>
    </div>
  );
}
