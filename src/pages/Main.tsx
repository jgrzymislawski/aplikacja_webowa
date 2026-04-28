import React, { useState } from "react";
import "./styles.css";

const App: React.FC = () => {
  const [active, setActive] = useState("dashboard");

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <p>Witaj w panelu głównym! Tu zobaczysz podsumowanie.</p>;

      case "settings":
        return <p>Ustawienia aplikacji — zmień konfigurację według potrzeb.</p>;

      case "profile":
        return <p>Twój profil — edytuj dane użytkownika.</p>;

      case "stats":
        return <p>Statystyki</p>;

      case "friends":
        return <p>Niestety nie masz przyjaciół.</p>;

      default:
        return <p>Wybierz zakładkę z menu.</p>;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Wydatkomat</h2>

        <ul className="menu">
          <li
            className={active === "dashboard" ? "active" : ""}
            onClick={() => setActive("dashboard")}
          >
            Płatności
          </li>

          <li
            className={active === "stats" ? "active" : ""}
            onClick={() => setActive("stats")}
          >
            Statystki
          </li>

          <li
            className={active === "friends" ? "active" : ""}
            onClick={() => setActive("friends")}
          >
            Znajomi
          </li>

          <li
            className={active === "profile" ? "active" : ""}
            onClick={() => setActive("profile")}
          >
            Powiadomienia
          </li>

          <li
            className={active === "settings" ? "active" : ""}
            onClick={() => setActive("settings")}
          >
            Ustawienia
          </li>
        </ul>

        <div className="logout">
          <button onClick={() => alert("Wylogowano!")}>Wyloguj się</button>
        </div>
      </aside>

      <main className="content">
        <h1>{active.toUpperCase()}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
