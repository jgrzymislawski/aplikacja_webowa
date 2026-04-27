import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <header className="header">
        <h1 className="logo">Expense Splitter</h1>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Zaloguj się
        </button>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h2>
            Zarządzaj i dziel się <span>wydatkami</span>
          </h2>
          <p>
            Prosta aplikacja do śledzenia wspólnych kosztów i kontrolowania
            finansów.
          </p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => navigate("/register")}>
              Zacznij zarządzać
            </button>
            <button
              className="secondary"
              onClick={() => {
                document
                  .getElementById("sekcja")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Dowiedz się więcej
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="sekcja">
        <div className="card">
          <h3>💸 Pełna kontrola nad Twoimi finansami — w jednym miejscu</h3>
          <p>
            Zarządzaj wydatkami w sposób przejrzysty i uporządkowany. Aplikacja
            pozwala na szybkie dodawanie transakcji, przypisywanie ich do
            kategorii oraz analizowanie, na co faktycznie przeznaczasz swoje
            pieniądze. Intuicyjne wykresy i podsumowania pomagają zrozumieć
            strukturę kosztów, identyfikować obszary do oszczędzania i świadomie
            planować budżet. Dzięki temu masz realny wpływ na swoje finanse i
            możesz podejmować lepsze decyzje każdego dnia.
          </p>
        </div>
        <div className="card">
          <h3>📊 Wspólne budżety i rozliczenia bez stresu</h3>
          <p>
            Twórz grupy wydatków ze znajomymi, rodziną lub współlokatorami i
            zapomnij o ręcznym liczeniu, kto komu ile powinien oddać. Aplikacja
            automatycznie rozlicza koszty, podpowiada wyrównania i eliminuje
            nieporozumienia. Idealnie sprawdza się przy wspólnych wyjazdach,
            zakupach domowych czy projektach, w których koszty dzielone są
            między kilka osób. Wszystko jest transparentne, uporządkowane i
            dostępne w każdej chwili.
          </p>
        </div>
        <div className="card">
          <h3>🔒 Bezpieczeństwo, wygoda i dostęp z każdego urządzenia</h3>
          <p>
            Twoje dane są chronione nowoczesnymi zabezpieczeniami, a dostęp do
            aplikacji wymaga bezpiecznego logowania. Interfejs został
            zaprojektowany tak, aby korzystanie z narzędzia było szybkie,
            intuicyjne i przyjemne — niezależnie od tego, czy używasz telefonu,
            tabletu czy komputera. Aplikacja działa w chmurze, więc masz dostęp
            do swoich finansów zawsze wtedy, gdy ich potrzebujesz, bez
            instalacji i skomplikowanej konfiguracji.
          </p>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Expense Splitter
      </footer>
    </div>
  );
}

export default Home;
