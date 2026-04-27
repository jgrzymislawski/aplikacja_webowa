function Start() {
  return (
    <div className="page">
      {/* HEADER */}
      <header className="header">
        <h1>Expense Splitter - Zarządzaj i dziel się wydatkami</h1>
        <button onClick={() => alert("Przejście do logowania")}>
          Zaloguj się
        </button>
      </header>

      {/* SEKCJA 1 */}
      <section className="section">
        <h2>O nas</h2>
        <p>
          Tutaj możesz wpisać opis swojej strony. Kim jesteś, co robisz itd.
        </p>
      </section>

      {/* SEKCJA 2 */}
      <section className="section">
        <h2>Oferta</h2>
        <p>Opisz swoją ofertę albo funkcje aplikacji.</p>
      </section>

      {/* SEKCJA 3 */}
      <section className="section">
        <h2>Kontakt</h2>
        <p>Email, social media albo inne dane kontaktowe.</p>
      </section>

      {/* STOPKA */}
      <footer className="footer">
        <p>© 2026 Moja Strona</p>
      </footer>
    </div>
  );
}

export default Start;
