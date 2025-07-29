// Represents either a username string or a populated user object (id + username)
export type UserRef = string | { _id: string; username: string };

// Represents one item/line in an expense (e.g., "Chicken Pizza", cost, and who shared it)
export interface ExpenseItem {
  _id: string; // MongoDB ObjectId string
  name: string; // Item name
  cost: number; // Cost for this item
  sharedBy: string[]; // Array of usernames (strings) who shared this item
}

// Represents an expense logged in a group
export interface Expense {
  _id?: string;
  date: string; // ISO date string (frontend format)
  restaurant?: string; // Optional restaurant name
  payer: UserRef; // Username string or user object who paid
  items: ExpenseItem[]; // Expense items
  totalCost: number; // Sum of costs for this expense
}

// Summary of financials for a group (calculated client-side)
export interface GroupSummary {
  totalCost: number; // Total spent by the group
  receivable: number; // Amount owed to current user
  payable: number; // Amount current user owes others
}

// Represents a person in receivables/payables lists (for UI display)
export interface PersonListItemType {
  id: string | number; // Usually username or user id
  name: string; // Display name
  amount: number; // Amount owed or to be received
  type?: "receivable" | "payable"; // Optional, UI hint to style accordingly
}

// Represents a group fetched from backend or used in frontend
export interface Group {
  _id: string; // MongoDB ObjectId
  name: string; // Group name
  admin: UserRef; // Username string or populated user object
  members: UserRef[]; // Array of usernames or user objects
  expenses: Expense[]; // Expenses within the group
  summary?: GroupSummary; // Optional summary info (frontend calc)
  groupReceivables?: PersonListItemType[]; // Optional tracking who owes current user
  groupPayables?: PersonListItemType[]; // Optional tracking who current user owes
}
