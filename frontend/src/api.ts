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
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ usernameOrEmail: username, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Login failed";
    throw new Error(errorMessage);
  }

  return data; // { token, user }
};

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // If response is plain text (non-JSON), use text instead
    const errorMessage =
      (data && data.message) || (await res.text()) || "Signup failed";
    throw new Error(errorMessage);
  }

  return data;
};

export const fetchGroupById = async (groupId: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    headers: getHeaders(),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to fetch group";
    throw new Error(errorMessage);
  }
  return data; // returns Group with expenses array
};

export const fetchGroups = async () => {
  const res = await fetch(`${API_BASE}/api/groups`, {
    headers: getHeaders(),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to fetch groups";
    throw new Error(errorMessage);
  }
  return data;
};

export const apiAddExpense = async (groupId: string, expenseData: any) => {
  const res = await fetch(`${API_BASE}/groups/${groupId}/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expenseData),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to add expense";
    throw new Error(errorMessage);
  }
  return data;
};

export const createGroup = async (name: string, admin: string) => {
  const res = await fetch(`${API_BASE}/api/groups`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, admin }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to create group";
    throw new Error(errorMessage);
  }
  return data;
};

export const deleteGroup = async (groupId: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to delete group";
    throw new Error(errorMessage);
  }
  return data;
};

export const addMember = async (groupId: string, username: string) => {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}/members`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to add member";
    throw new Error(errorMessage);
  }

  return data;
};

export const apiEditExpense = async (
  groupId: string,
  expenseId: string,
  expenseData: any
) => {
  const res = await fetch(
    `${API_BASE}/api/groups/${groupId}/expenses/${expenseId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to update expense";
    throw new Error(errorMessage);
  }
  return data;
};

export const addExpense = async (groupId: string, expenseData: any) => {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expenseData),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to add expense";
    throw new Error(errorMessage);
  }
  return data;
};

export const editExpense = async (
  groupId: string,
  expenseId: string,
  expenseData: any
) => {
  const res = await fetch(
    `${API_BASE}/api/groups/${groupId}/expenses/${expenseId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMessage = data?.message || "Failed to edit expense";
    throw new Error(errorMessage);
  }
  return data;
};
