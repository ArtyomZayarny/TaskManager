import { UserCreads } from "./types";

export const storeToLS = (key: string, value: any) => {
  // Don't store undefined or null values
  if (value === undefined || value === null) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

export const setAccessTokenToLS = (token: string) => {
  localStorage.setItem("access_token", JSON.stringify(token));
};

export const AuthRequest = async (
  requestString: string,
  creads: UserCreads
) => {
  const res = await fetch(requestString, {
    method: "POST",
    body: JSON.stringify(creads),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};
