export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem("access_token", JSON.stringify(access_token));
};

export const AuthRequest = async (requestString: string, creads) => {
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
