import React, { useState } from "react";
import "./styles.css";

type ActivePage =
  | "dashboard"
  | "stats"
  | "friends"
  | "notifications"
  | "settings";

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  date: string;
};

type ExpenseForm = {
  title: string;
  amount: string;
  category: string;
  paidBy: string;
  date: string;
};

type Friend = {
  id: number;
  name: string;
  email: string;
  expenses: number;
  activity: string;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  time: string;
};

const App: React.FC = () => {
  const [active, setActive] = useState<ActivePage>("dashboard");
  const [showModal, setShowModal] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: "Zakupy spożywcze",
      amount: 124.5,
      category: "Jedzenie",
      paidBy: "Marek",
      date: "2026-04-29",
    },
    {
      id: 2,
      title: "Obiad w restauracji",
      amount: 86.0,
      category: "Wspólne wyjście",
      paidBy: "Ola",
      date: "2026-04-28",
    },
    {
      id: 3,
      title: "Benzyna",
      amount: 210.0,
      category: "Transport",
      paidBy: "Kuba",
      date: "2026-04-27",
    },
  ]);

  const removeFriend = (id: number) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== id));
  };

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Kuba Nowak",
      email: "kuba@gmail.com",
      expenses: 12,
      activity: "2 dni temu",
    },

    {
      id: 2,
      name: "Ola Kowalska",
      email: "ola@gmail.com",
      expenses: 8,
      activity: "Dzisiaj",
    },

    {
      id: 3,
      name: "Marek Wiśniewski",
      email: "marek@gmail.com",
      expenses: 5,
      activity: "5 minut temu",
    },
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [form, setForm] = useState<ExpenseForm>({
    title: "",
    amount: "",
    category: "",
    paidBy: "",
    date: "",
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nowy wydatek",
      message: "Ola dodała wydatek: Zakupy spożywcze",
      read: false,
      time: "2 min temu",
    },

    {
      id: 2,
      title: "Rozliczenie",
      message: "Kuba rozliczył wydatek Benzyna",
      read: true,
      time: "1 godz temu",
    },

    {
      id: 3,
      title: "Nowy znajomy",
      message: "Marek zaakceptował zaproszenie",
      read: false,
      time: "Wczoraj",
    },
  ]);

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: !notification.read,
            }
          : notification,
      ),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.amount ||
      !form.category ||
      !form.paidBy ||
      !form.date
    ) {
      alert("Uzupełnij wszystkie pola.");
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
      paidBy: form.paidBy,
      date: form.date,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setForm({
      title: "",
      amount: "",
      category: "",
      paidBy: "",
      date: "",
    });

    setShowModal(false);
  };

  const removeExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (!startDate || !endDate) return true;

    return expense.date >= startDate && expense.date <= endDate;
  });

  const totalPayments = filteredExpenses.length;

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const averagePerPayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return (
          <div className="dashboard">
            <div className="dashboard-top">
              <div>
                <h1>WYDATKI</h1>

                <p>Witaj w panelu głównym!</p>
                <p>Tu zobaczysz wszystkie swoje wydatki.</p>
              </div>

              <button
                className="add-expense-btn"
                onClick={() => setShowModal(true)}
              >
                + Utwórz wydatek
              </button>
            </div>

            {/* MOJE WYDATKI */}
            <h2 className="section-title">Moje płatności</h2>

            <div className="expenses-grid">
              {expenses
                .filter((expense) => expense.paidBy === "Ja")
                .map((expense) => (
                  <div className="expense-card" key={expense.id}>
                    <div className="expense-card-header">
                      <h3>{expense.title}</h3>

                      <span className="expense-amount">
                        {expense.amount.toFixed(2)} zł
                      </span>
                    </div>

                    <p className="expense-meta">
                      Kategoria: {expense.category}
                    </p>

                    <p className="expense-meta">Zapłacił: {expense.paidBy}</p>

                    <p className="expense-meta">Data: {expense.date}</p>

                    <button
                      className="delete-expense-btn"
                      onClick={() => removeExpense(expense.id)}
                    >
                      Usuń wydatek
                    </button>
                  </div>
                ))}
            </div>

            {/* MUSZĘ ZAPŁACIĆ */}
            <h2 className="section-title debt-title">Muszę zapłacić</h2>

            <div className="expenses-grid">
              {expenses
                .filter((expense) => expense.paidBy !== "Ja")
                .map((expense) => (
                  <div className="expense-card debt-card" key={expense.id}>
                    <div className="expense-card-header">
                      <h3>{expense.title}</h3>

                      <span className="expense-amount debt-amount">
                        {expense.amount.toFixed(2)} zł
                      </span>
                    </div>

                    <p className="expense-meta">
                      Kategoria: {expense.category}
                    </p>

                    <p className="expense-meta">
                      Do oddania dla: {expense.paidBy}
                    </p>

                    <p className="expense-meta">Data: {expense.date}</p>

                    <button
                      className="delete-expense-btn"
                      onClick={() => removeExpense(expense.id)}
                    >
                      Usuń wydatek
                    </button>
                  </div>
                ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="settings-page">
            <div className="dashboard-top">
              <div>
                <h1>USTAWIENIA</h1>

                <p>Zarządzaj swoim profilem i bezpieczeństwem konta.</p>
              </div>
            </div>

            <div className="settings-grid">
              {/* DANE UŻYTKOWNIKA */}
              <div className="expense-card">
                <div className="expense-card-header">
                  <h3>Dane użytkownika</h3>
                </div>

                <form className="settings-form">
                  <label>
                    Imię
                    <input
                      type="text"
                      className="settings-input"
                      defaultValue="Kuba"
                    />
                  </label>

                  <label>
                    Nazwisko
                    <input
                      type="text"
                      className="settings-input"
                      defaultValue="Nowak"
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      className="settings-input disabled-input"
                      value="kubanowak@gmail.com"
                      disabled
                    />
                  </label>

                  <label>
                    Rola użytkownika
                    <input
                      type="text"
                      className="settings-input disabled-input"
                      value="Administrator"
                      disabled
                    />
                  </label>

                  <button
                    type="button"
                    className="save-btn"
                    onClick={() => alert("Dane zapisane")}
                  >
                    Zapisz zmiany
                  </button>
                </form>
              </div>

              {/* ZMIANA HASŁA */}
              <div className="expense-card">
                <div className="expense-card-header">
                  <h3>Zmień hasło</h3>
                </div>

                <form className="settings-form">
                  <input
                    type="password"
                    placeholder="Nowe hasło"
                    className="settings-input"
                  />

                  <input
                    type="password"
                    placeholder="Powtórz hasło"
                    className="settings-input"
                  />

                  <button
                    className="save-btn"
                    onClick={() => alert("Hasło zmienione")}
                    type="button"
                  >
                    Zapisz hasło
                  </button>
                </form>
              </div>
              {/* DWUETAPOWE UWIERZYTELNIANIE */}
              <div className="expense-card">
                <div className="expense-card-header">
                  <h3>Dwuetapowe uwierzytelnianie</h3>
                </div>

                <p className="expense-meta">
                  Zabezpiecz konto dodatkowym kodem logowania.
                </p>

                <div className="twofa-box">
                  <div>
                    <p className="twofa-status">Status: Wyłączone</p>
                  </div>

                  <button
                    className="twofa-btn"
                    onClick={() => alert("2FA zostało włączone")}
                  >
                    Włącz 2FA
                  </button>
                </div>
              </div>
              {/* USUŃ KONTO */}
              <div className="expense-card danger-card">
                <div className="expense-card-header">
                  <h3>Usuń konto</h3>
                </div>

                <p className="expense-meta">Ta operacja jest nieodwracalna.</p>

                <button
                  className="delete-account-btn"
                  onClick={() => alert("Konto usunięte")}
                >
                  Usuń konto
                </button>
              </div>
            </div>
          </div>
        );

      case "friends":
        return (
          <div className="friends-page">
            <div className="dashboard-top">
              <div>
                <h1>ZNAJOMI</h1>

                <p>
                  Zarządzaj znajomymi i dodawaj osoby do wspólnych wydatków.
                </p>
              </div>

              <button
                className="add-expense-btn"
                onClick={() => setShowFriendModal(true)}
              >
                + Dodaj znajomego
              </button>
            </div>

            <h2 className="section-title">Lista znajomych</h2>

            <div className="expenses-grid">
              {friends.map((friend) => (
                <div className="expense-card" key={friend.id}>
                  <div className="expense-card-header">
                    <h3>{friend.name}</h3>

                    <span className="expense-amount">
                      {friend.expenses} wydatków
                    </span>
                  </div>

                  <p className="expense-meta">Email: {friend.email}</p>

                  <p className="expense-meta">Aktywność: {friend.activity}</p>

                  <button
                    className="delete-expense-btn"
                    onClick={() => removeFriend(friend.id)}
                  >
                    Usuń znajomego
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="stats-page">
            <div className="dashboard-top">
              <div>
                <h1>STATYSTYKI</h1>

                <p>Podsumowanie wydatków w wybranym okresie.</p>
              </div>
            </div>

            {/* FILTRY */}

            <div className="stats-filters">
              <div className="filter-group">
                <label>Data od</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Data do</label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="search-btn-wrapper">
                <button
                  className="stats-search-btn"
                  onClick={() => alert("Wyniki zostały przefiltrowane")}
                >
                  Szukaj
                </button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Łączna liczba płatności</h3>

                <span className="stat-value">{totalPayments}</span>
              </div>

              <div className="stat-card">
                <h3>Łączna kwota</h3>

                <span className="stat-value">{totalAmount.toFixed(2)} zł</span>
              </div>

              <div className="stat-card">
                <h3>Średnia na płatność</h3>

                <span className="stat-value">
                  {averagePerPayment.toFixed(2)} zł
                </span>
              </div>
            </div>

            {/* LISTA */}

            <h2 className="section-title">Wydatki w wybranym okresie</h2>

            <div className="expenses-grid">
              {filteredExpenses.map((expense) => (
                <div className="expense-card" key={expense.id}>
                  <div className="expense-card-header">
                    <h3>{expense.title}</h3>

                    <span className="expense-amount">
                      {expense.amount.toFixed(2)} zł
                    </span>
                  </div>

                  <p className="expense-meta">Kategoria: {expense.category}</p>

                  <p className="expense-meta">Zapłacił: {expense.paidBy}</p>

                  <p className="expense-meta">Data: {expense.date}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="notifications-page">
            <div className="dashboard-top">
              <div>
                <h1>POWIADOMIENIA</h1>

                <p>
                  Tutaj znajdziesz wszystkie informacje dotyczące wydatków i
                  znajomych.
                </p>
              </div>
            </div>

            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    notification.read ? "read" : "unread"
                  }`}
                >
                  <div className="notification-header">
                    <div>
                      <h3>{notification.title}</h3>

                      <p className="notification-time">{notification.time}</p>
                    </div>

                    <div className="notification-actions">
                      <button
                        className="read-btn"
                        onClick={() => toggleRead(notification.id)}
                      >
                        {notification.read ? "Nieodczytane" : "Odczytane"}
                      </button>
                    </div>
                  </div>

                  <p className="notification-message">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        );

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
            Statystyki
          </li>

          <li
            className={active === "friends" ? "active" : ""}
            onClick={() => setActive("friends")}
          >
            Znajomi
          </li>

          <li
            className={active === "notifications" ? "active" : ""}
            onClick={() => setActive("notifications")}
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

      <main className="content">{renderContent()}</main>

      {/* MODAL ZNAJOMI */}
      {showFriendModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowFriendModal(false)}
        >
          <div
            className="modal friend-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Dodaj znajomego</h2>

              <button
                className="close-btn"
                onClick={() => setShowFriendModal(false)}
              >
                ×
              </button>
            </div>

            <div className="friend-search-box">
              <input
                type="text"
                placeholder="Wpisz email lub nazwę użytkownika"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
              />

              <button
                className="search-friend-btn"
                onClick={() => alert(`Szukasz: ${friendSearch}`)}
              >
                Zaproś
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nowy wydatek</h2>

              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form className="expense-form" onSubmit={handleAddExpense}>
              <label>
                Nazwa wydatku
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Np. Zakupy spożywcze"
                />
              </label>

              <label>
                Kwota
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Np. 120"
                />
              </label>

              <label>
                Kategoria
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Wybierz kategorię</option>
                  <option value="Jedzenie">Jedzenie</option>
                  <option value="Transport">Transport</option>
                  <option value="Rozrywka">Rozrywka</option>
                  <option value="Dom">Dom</option>
                  <option value="Inne">Inne</option>
                </select>
              </label>

              <label>
                Zapłacił
                <input
                  type="text"
                  name="paidBy"
                  value={form.paidBy}
                  onChange={handleChange}
                  placeholder="Np. Ola"
                />
              </label>

              <label>
                Data
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </label>

              <button type="submit" className="submit-btn">
                Dodaj wydatek
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
