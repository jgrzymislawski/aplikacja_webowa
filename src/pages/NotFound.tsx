import "./NotFound.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Strona nie została znaleziona</h2>
      <p>Ups... wygląda na to, że trafiłeś w złe miejsce.</p>
      <Link to="/" className="btn-primary">
        Wróć do strony głównej
      </Link>
    </div>
  );
}
