export type Share = {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  amount: number;   // ← TO JEST KLUCZOWE
  isPaid?: boolean; // jeśli backend kiedyś doda
};


export type Expense = {
  id: string;
  title: string;
  description: string;
  role: "PAYER" | "PARTICIPANT";
  payer: {
    id: string;
    name: string;
    email: string;
  };
  amountTotal: number;
  splitType: string;
  shares: Share[];
  expenseDate: string;
};
