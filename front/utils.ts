import { UserCreads } from "./types";

export const storeToLS = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
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
