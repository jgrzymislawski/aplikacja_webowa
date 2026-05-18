import React from "react";
import type { Friend } from "../types/Friend";
import type { ExpenseForm } from "../types/ExpenseForm";

type Props = {
  form: ExpenseForm;
  friends: Friend[];
  selectedFriends: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFriend: (id: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const AddExpenseModal: React.FC<Props> = ({
  form,
  friends,
  selectedFriends,
  onChange,
  onToggleFriend,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nowy wydatek</h2>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form
          className="expense-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <label>
            Nazwa wydatku
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
            />
          </label>

          <label>
            Opis
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={onChange}
            />
          </label>

          <label>
            Kwota
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={onChange}
            />
          </label>

          <label>Uczestnicy</label>
          <div className="participants-list">
            {friends.map((friend) => (
              <label key={friend.id}>
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={() => onToggleFriend(friend.id)}
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
              onChange={onChange}
            />
          </label>

          <button type="submit" className="submit-btn">
            Dodaj wydatek
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
