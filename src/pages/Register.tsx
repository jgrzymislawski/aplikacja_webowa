import "./Auth.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Rejestracja</h2>

        <form>
          <input type="text" placeholder="Imię" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Hasło" required />

          <button type="submit">Zarejestruj się</button>
        </form>

        <p>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
