import React, { useEffect, useState } from "react";
import "./styles.css";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import {
  getPaymentStatistics,
  getExpenseStatistics,
} from "../api/statisticsService";
import { getMyExpenses, createExpense } from "../api/expensesService";
import { getPayments } from "../api/paymentsService";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  enable2FA,
  confirm2FA,
  disable2FA,
} from "../api/profileService";
import {
  getFriends,
  addFriend,
  removeFriendApi,
  acceptFriend,
  rejectFriend,
} from "../api/friendsService";

import type { Friend } from "../types/Friend";
import type { Friendship } from "../types/Friendship";

type ActivePage =
  | "dashboard"
  | "stats"
  | "friends"
  | "notifications"
  | "settings";

export type Expense = {
  id: string;
  title: string;
  amountTotal: number;
  expenseDate: string;
  role: "PAYER" | "PARTICIPANT";
};


type ExpenseForm = {
  title: string;
  amount: string;
  description: string;
  date: string;
};

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const App: React.FC = () => {
  const [active, setActive] = useState<ActivePage>("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    isTwoFactorAuthEnabled: false,
  });

  const [user, setUser] = useState<User | null>(null);
  const [myExpenses, setMyExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Expense[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriends, setPendingFriends] = useState<Friendship[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const [form, setForm] = useState<ExpenseForm>({
    title: "",
    amount: "",
    description: "",
    date: "",
  });

  const [settingsForm, setSettingsForm] = useState({
    firstName: "",
    lastName: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [twoFaCode, setTwoFaCode] = useState("");

  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    averagePerPayment: 0,
  });

  const [expenseStats, setExpenseStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    averagePerExpense: 0,
  });
  useEffect(() => {
  loadExpenses();
}, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [friendSearch, setFriendSearch] = useState("");

  const closeModal = () => setShowModal(false);

  const logout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const loadExpenses = async () => {
    try {
      const my = await getMyExpenses();
      const pay = await getPayments();
      console.log("📦 API → myExpenses:", my);
    console.log("📦 API → payments:", pay);
      setMyExpenses(Array.isArray(my.content) ? my.content : []);
      setPayments(Array.isArray(pay.content) ? pay.content : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (active !== "dashboard") return;

    const fetch = async () => {
      try {
        const my = await getMyExpenses();
        const pay = await getPayments();

        setMyExpenses(Array.isArray(my.content) ? my.content : []);
        setPayments(Array.isArray(pay.content) ? pay.content : []);
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, [active]);

  useEffect(() => {
  if (!localStorage.getItem("accessToken")) return;

  const loadPending = async () => {
    const res = await getFriends("PENDING");
    setPendingFriends(res);
  };

  loadPending();
}, [profile.id]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return;
    const loadFriends = async () => {
      const res: Friendship[] = await getFriends("ACCEPTED");

      const mapped: Friend[] = res.map((f) => {
        const isRequester = f.requester.id === profile.id;
        const friendUser = isRequester ? f.recipient : f.requester;

        return {
          friendshipId: f.id,
          id: friendUser.id,
          email: friendUser.email,
        };
      });

      setFriends(mapped);
    };

    loadFriends();
  }, [profile.id]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return;
    getProfile().then((data) => {
      setProfile(data);
      setSettingsForm({ firstName: data.firstName, lastName: data.lastName });
      setUser({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    });
  }, []);

  const handleSearchStats = async () => {
    if (!startDate || !endDate) {
      alert("Podaj zakres dat!");
      return;
    }

    try {
      const paymentsStats = await getPaymentStatistics(startDate, endDate);
      const expensesStats = await getExpenseStatistics(startDate, endDate);

      setStats(paymentsStats);
      setExpenseStats(expensesStats);
    } catch {
      alert("Błąd podczas pobierania statystyk.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(settingsForm);
      alert("Dane zapisane!");
    } catch {
      alert("Błąd podczas zapisywania danych.");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.repeatNewPassword) {
      alert("Hasła nie są takie same!");
      return;
    }
    try {
      await changePassword(passwordForm);
      alert("Hasło zmienione!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      });
    } catch {
      alert("Błąd podczas zmiany hasła.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć!",
      )
    )
      return;
    try {
      await deleteAccount();
      await logout();
    } catch {
      alert("Błąd podczas usuwania konta.");
    }
  };

  const handleEnable2FA = async () => {
    try {
      const qr = await enable2FA();
      setQrCode(qr);
    } catch {
      alert("Błąd podczas włączania 2FA.");
    }
  };

  const handleConfirm2FA = async () => {
    try {
      await confirm2FA(twoFaCode);
      alert("2FA zostało włączone!");
      setQrCode(null);
      setTwoFaCode("");
      setProfile((prev) => ({ ...prev, isTwoFactorAuthEnabled: true }));
    } catch {
      alert("Nieprawidłowy kod. Spróbuj ponownie.");
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("Czy na pewno chcesz wyłączyć 2FA?")) return;
    try {
      await disable2FA();
      alert("2FA zostało wyłączone.");
      setProfile((prev) => ({ ...prev, isTwoFactorAuthEnabled: false }));
    } catch {
      alert("Błąd podczas wyłączania 2FA.");
    }
  };

  const handleAcceptFriend = async (id: string) => {
  await acceptFriend(id);

  setPendingFriends((prev) => prev.filter((f) => f.id !== id));

  const updatedRaw = await getFriends("ACCEPTED");

  const mapped = updatedRaw.map((f: Friendship) => {
    const isRequester = f.requester.id === profile.id;
    const friendUser = isRequester ? f.recipient : f.requester;

    return {
      friendshipId: f.id,
      id: friendUser.id,
      email: friendUser.email,
    };
  });

  setFriends(mapped);
};


  const handleRejectFriend = async (id: string) => {
    await rejectFriend(id);
    setPendingFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const removeFriend = async (friendshipId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć znajomego?")) return;

    try {
      await removeFriendApi(friendshipId);
      setFriends((prev) => prev.filter((f) => f.friendshipId !== friendshipId));
    } catch {
      alert("Nie udało się usunąć znajomego.");
    }
  };

  const handleAddFriend = async () => {
  if (!friendSearch) {
    alert("Wpisz ID znajomego.");
    return;
  }

  try {
    await addFriend(friendSearch);

    const updatedRaw = await getFriends("ACCEPTED");

    const mapped = updatedRaw.map((f: Friendship) => {
      const isRequester = f.requester.id === profile.id;
      const friendUser = isRequester ? f.recipient : f.requester;

      return {
        friendshipId: f.id,
        id: friendUser.id,
        email: friendUser.email,
      };
    });

    setFriends(mapped);
    setShowFriendModal(false);
    setFriendSearch("");
    alert("Zaproszenie wysłane!");
  } catch {
    alert("Nie udało się wysłać zaproszenia.");
  }
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

  const handleAddExpense = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!user) {
      alert("Brak danych użytkownika.");
      return;
    }

    try {
  const payload = {
    title: form.title,
    description: form.description,
    amount: Number(form.amount),
    expenseDate: new Date(form.date).toISOString(),
    participants: selectedFriends.map((id) => ({ userId: id })),
  };

  await createExpense(payload);
  closeModal();
  await loadExpenses();

  setForm({ title: "", amount: "", description: "", date: "" });
  setSelectedFriends([]);
} catch (err) {
  console.error(err);
  alert("Nie udało się dodać wydatku.");
}
  };

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

            <h2>Moje wydatki</h2>
            {(myExpenses ?? []).map((exp) => (

              <div className="expense-card" key={exp.id}>
                <h3>{exp.title}</h3>
<p>Kwota: {exp.amountTotal} zł</p>
<p>Data: {new Date(exp.expenseDate).toLocaleDateString()}</p>
<p>Rola: {exp.role}</p>


              </div>
            ))}

            <h2>Muszę zapłacić</h2>
{payments.map((pay) => (
  <div className="expense-card" key={pay.id}>
    <h3>{pay.title}</h3>
    <p>Kwota: {pay.amountTotal} zł</p>
    <p>Data: {new Date(pay.expenseDate).toLocaleDateString()}</p>
    <p>Rola: {pay.role}</p>
  </div>
))}

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
              <div className="expense-card">
                <div className="expense-card-header">
                  <h3>Dane użytkownika</h3>
                </div>

                <form className="settings-form">
                  <label>
                    ID użytkownika
                    <input
                      type="text"
                      className="settings-input disabled-input"
                      value={profile.id}
                      disabled
                    />
                  </label>

                  <label>
                    Imię
                    <input
                      type="text"
                      className="settings-input"
                      value={settingsForm.firstName}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Nazwisko
                    <input
                      type="text"
                      className="settings-input"
                      value={settingsForm.lastName}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      className="settings-input disabled-input"
                      value={profile.email}
                      disabled
                    />
                  </label>

                  <label>
                    Rola użytkownika
                    <input
                      type="text"
                      className="settings-input disabled-input"
                      value={profile.role}
                      disabled
                    />
                  </label>

                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleUpdateProfile}
                  >
                    Zapisz zmiany
                  </button>
                </form>
              </div>

              <div className="expense-card">
                <div className="expense-card-header">
                  <h3>Zmień hasło</h3>
                </div>

                <form className="settings-form">
                  <input
                    type="password"
                    placeholder="Stare hasło"
                    className="settings-input"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="password"
                    placeholder="Nowe hasło"
                    className="settings-input"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="password"
                    placeholder="Powtórz hasło"
                    className="settings-input"
                    value={passwordForm.repeatNewPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        repeatNewPassword: e.target.value,
                      }))
                    }
                  />

                  <button
                    className="save-btn"
                    onClick={handleChangePassword}
                    type="button"
                  >
                    Zapisz hasło
                  </button>
                </form>
              </div>

              <div className="expense-card">
                <div className="expense-card-header">
                  <h3>Dwuetapowe uwierzytelnianie</h3>
                </div>

                <p className="expense-meta">
                  Zabezpiecz konto dodatkowym kodem logowania.
                </p>

                <div className="twofa-box">
                  <div>
                    <p className="twofa-status">
                      Status:{" "}
                      {profile.isTwoFactorAuthEnabled
                        ? "Włączone ✅"
                        : "Wyłączone ❌"}
                    </p>
                  </div>

                  {!profile.isTwoFactorAuthEnabled ? (
                    <button className="twofa-btn" onClick={handleEnable2FA}>
                      Włącz 2FA
                    </button>
                  ) : (
                    <button
                      className="delete-expense-btn"
                      onClick={handleDisable2FA}
                    >
                      Wyłącz 2FA
                    </button>
                  )}
                </div>

                {qrCode && (
                  <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <p className="expense-meta">
                      Zeskanuj kod QR w Google Authenticator:
                    </p>
                    <img
                      src={qrCode}
                      alt="QR kod 2FA"
                      style={{
                        width: "180px",
                        margin: "12px auto",
                        display: "block",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Wpisz kod z aplikacji (6 cyfr)"
                      value={twoFaCode}
                      onChange={(e) => setTwoFaCode(e.target.value)}
                      className="settings-input"
                      maxLength={6}
                    />
                    <button
                      className="save-btn"
                      onClick={handleConfirm2FA}
                      style={{ marginTop: "8px" }}
                    >
                      Potwierdź 2FA
                    </button>
                  </div>
                )}
              </div>

              <div className="expense-card danger-card">
                <div className="expense-card-header">
                  <h3>Usuń konto</h3>
                </div>

                <p className="expense-meta">Ta operacja jest nieodwracalna.</p>

                <button
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
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
                  <p className="expense-meta">Email: {friend.email}</p>

                  <button
                    className="delete-expense-btn"
                    onClick={() => removeFriend(friend.friendshipId)}
                  >
                    Usuń znajomego
                  </button>
                </div>
              ))}
            </div>

            <h2 className="section-title">Zaproszenia</h2>

            <div className="expenses-grid">
              {pendingFriends.length === 0 && (
                <p className="expense-meta">Brak oczekujących zaproszeń.</p>
              )}

              {pendingFriends.map((friendship) => {
  const isRecipient = friendship.recipient.id === profile.id;
  const otherUser = isRecipient ? friendship.requester : friendship.recipient;

  return (
    <div className="expense-card" key={`pending-${friendship.id}`}>
      <div className="expense-card-header">
        <h3>Zaproszenie do znajomych</h3>
        <span className="expense-amount">Oczekujące</span>
      </div>

      <p className="expense-meta">Od: {otherUser.email}</p>

      {isRecipient && (
  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
    <button
      className="save-btn"
      onClick={() => handleAcceptFriend(friendship.id)}
    >
      Akceptuj
    </button>

    <button
      className="delete-expense-btn"
      onClick={() => handleRejectFriend(friendship.id)}
    >
      Odrzuć
    </button>
  </div>
)}
    </div>
  );
})}

            </div>
          </div>
        );

      case "stats":
        return (
          <div className="stats-page">
            <div className="dashboard-top">
              <div>
                <h1>STATYSTYKI</h1>
                <p>Podsumowanie wydatków i płatności w wybranym okresie.</p>
              </div>
            </div>

            <div className="date-filters">
              <label>
                Data od:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>

              <label>
                Data do:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>

              <button className="save-btn" onClick={handleSearchStats}>
                Szukaj
              </button>
            </div>

            <div className="stats-summary">
              <h2>Płatności</h2>
              <p>Łączna liczba płatności: {stats.totalPayments}</p>
              <p>Łączna kwota: {stats.totalAmount.toFixed(2)} zł</p>
              <p>
                Średnia na płatność: {stats.averagePerPayment.toFixed(2)} zł
              </p>
            </div>

            <div className="stats-summary">
              <h2>Wydatki</h2>
              <p>Łączna liczba wydatków: {expenseStats.totalExpenses}</p>
              <p>Łączna kwota: {expenseStats.totalAmount.toFixed(2)} zł</p>
              <p>
                Średnia na wydatek: {expenseStats.averagePerExpense.toFixed(2)}{" "}
                zł
              </p>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="notifications-page">
            <h1>POWIADOMIENIA</h1>

            <div className="expenses-grid">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`expense-card ${n.isRead ? "read" : "unread"}`}
                >
                  <div className="expense-card-header">
                    <div className="expense-card-header">
                      <h3>{n.title}</h3>
                    </div>

                    <span className="notification-date">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="expense-meta">{n.body}</p>

                  {!n.isRead && (
                    <button
                      className="save-btn"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      Oznacz jako przeczytane
                    </button>
                  )}
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
          <button onClick={logout}>Wyloguj się</button>
        </div>
      </aside>

      <main className="content">{renderContent()}</main>

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
                placeholder="Wpisz id użytkownika"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
              />

              <button className="search-friend-btn" onClick={handleAddFriend}>
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

              <button className="close-btn" onClick={closeModal}>
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
                Opis
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Np. Kolacja po konferencji"
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

              <label>Uczestnicy</label>
              <div className="participants-list">
                {friends.map((friend) => (
                  <label
                    key={friend.id}
                    style={{ display: "block", marginBottom: 4 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => {
                        setSelectedFriends((prev) =>
                          prev.includes(friend.id)
                            ? prev.filter((id) => id !== friend.id)
                            : [...prev, friend.id],
                        );
                      }}
                    />
                    ({friend.email})
                  </label>
                ))}
              </div>

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
