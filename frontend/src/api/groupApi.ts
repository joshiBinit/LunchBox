const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

export const createGroup = async (groupName: string, token: string) => {
  const response = await fetch(`${BACKEND_URL}api/groups/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: groupName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create group");
  }

  return await response.json();
};

export const getMyGroups = async (token: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}api/groups/my-groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch groups");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("getMyGroups error:", err);
    throw err;
  }
};
