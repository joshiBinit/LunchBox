export interface ExpenseItem {
  id: number;
  name: string;
  cost: number;
  sharedBy: string[];
}

export interface Expense {
  id: number;
  date: string;
  restaurant?: string;
  payer: string;
  items: ExpenseItem[];
  totalCost: number;
}

export interface GroupSummary {
  totalCost: number;
  receivable: number;
  payable: number;
}

export interface PersonListItemType {
  id: string | number;
  name: string;
  amount: number;
  type?: "receivable" | "payable";
}

export interface Group {
  id: number;
  name: string;
  admin: string;
  members: string[];
  expenses: Expense[];
  summary?: GroupSummary;
  groupReceivables?: PersonListItemType[];
  groupPayables?: PersonListItemType[];
}
