const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
};

export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ usernameOrEmail: username, password }),
  });
  if (!res.ok) throw new Error("Login failed");

  return res.json(); // { token, user }
};

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Signup failed");
  }
  return res.json();
};

export const fetchGroupById = async (groupId: string) => {
  const res = await fetch(`${API_BASE}/groups/${groupId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch group");
  return res.json(); // returns Group with expenses array
};

export const fetchGroups = async () => {
  const res = await fetch(`${API_BASE}/groups`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
};
export const apiAddExpense = async (groupId: string, expenseData: any) => {
  const res = await fetch(`${API_BASE}/groups/${groupId}/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expenseData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to add expense");
  }
  return res.json();
};

export const createGroup = async (name: string, admin: string) => {
  const res = await fetch(`${API_BASE}/groups`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, admin }),
  });
  if (!res.ok) throw new Error("Failed to create group");
  return res.json();
};

export const deleteGroup = async (groupId: string) => {
  const res = await fetch(`${API_BASE}/groups/${groupId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete group");
  return res.json();
};

export const addMember = async (groupId: string, username: string) => {
  const res = await fetch(`${API_BASE}/groups/${groupId}/members`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Failed to add member");
  return res.json();
};
export const apiEditExpense = async (
  groupId: string,
  expenseId: string,
  expenseData: any
) => {
  const res = await fetch(
    `${API_BASE}/groups/${groupId}/expenses/${expenseId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update expense");
  }
  return res.json();
};

export const addExpense = async (groupId: string, expenseData: any) => {
  const res = await fetch(`${API_BASE}/groups/${groupId}/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expenseData),
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
};

export const editExpense = async (
  groupId: string,
  expenseId: string,
  expenseData: any
) => {
  const res = await fetch(
    `${API_BASE}/groups/${groupId}/expenses/${expenseId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    }
  );
  if (!res.ok) throw new Error("Failed to edit expense");
  return res.json();
};
