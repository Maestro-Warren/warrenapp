export interface Budget {
  id: string;
  createdAt: Date;
  name: string;
  amount: number;
  emoji: string | null;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  emoji: string | null;
  description: string;
  createdAt: Date;
  budgetName?: string | null;
  budgetId: string | null;
}
