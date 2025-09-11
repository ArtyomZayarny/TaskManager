import { account, ID } from "@/appwrite";

export const createAppwriteSession = async (
  email: string,
  password: string
) => {
  try {
    const cleanEmail = email.replace(/"/g, "").trim();
    const cleanPassword = password.replace(/"/g, "").trim();

    const session = await account.createEmailSession(cleanEmail, cleanPassword);
    return session;
  } catch (error) {
    throw error;
  }
};

export const createAppwriteAccount = async (
  email: string,
  password: string
) => {
  try {
    const cleanEmail = email.replace(/"/g, "").trim();
    const cleanPassword = password.replace(/"/g, "").trim();

    const user = await account.create(ID.unique(), cleanEmail, cleanPassword);
    return user;
  } catch (error) {
    throw error;
  }
};

let userCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000;

export const getCurrentAppwriteUser = async () => {
  const now = Date.now();

  if (userCache && now - cacheTimestamp < CACHE_DURATION) {
    return userCache;
  }

  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      userCache = null;
      cacheTimestamp = now;
      return null;
    }

    const user = await account.get();
    userCache = user;
    cacheTimestamp = now;
    return user;
  } catch (error) {
    userCache = null;
    cacheTimestamp = now;
    return null;
  }
};

export const deleteAppwriteSession = async () => {
  try {
    await account.deleteSession("current");
    userCache = null;
    cacheTimestamp = 0;
  } catch (error) {}
};

export const clearUserCache = () => {
  userCache = null;
  cacheTimestamp = 0;
};
