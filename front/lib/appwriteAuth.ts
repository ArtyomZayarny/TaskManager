import { account, ID } from "@/appwrite";

export const createAppwriteSession = async (
  email: string,
  password: string
) => {
  try {
    // Очищаем email от лишних кавычек
    const cleanEmail = email.replace(/"/g, "").trim();
    const cleanPassword = password.replace(/"/g, "").trim();

    console.log("Clean email:", cleanEmail);
    console.log("Clean password:", cleanPassword);

    const session = await account.createEmailSession(cleanEmail, cleanPassword);
    return session;
  } catch (error) {
    console.error("Appwrite auth error:", error);
    throw error;
  }
};

export const createAppwriteAccount = async (
  email: string,
  password: string
) => {
  try {
    // Очищаем email от лишних кавычек
    const cleanEmail = email.replace(/"/g, "").trim();
    const cleanPassword = password.replace(/"/g, "").trim();

    console.log("Clean email:", cleanEmail);
    console.log("Clean password:", cleanPassword);

    // Создаем аккаунт в Appwrite
    const user = await account.create(ID.unique(), cleanEmail, cleanPassword);
    return user;
  } catch (error) {
    console.error("Appwrite registration error:", error);
    throw error;
  }
};

// Кэш для избежания повторных запросов
let userCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 секунд

export const getCurrentAppwriteUser = async () => {
  const now = Date.now();

  // Возвращаем кэшированный результат если он еще актуален
  if (userCache && now - cacheTimestamp < CACHE_DURATION) {
    return userCache;
  }

  try {
    // Проверяем, есть ли токен в localStorage перед запросом
    const token = localStorage.getItem("access_token");
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
    // Не логируем ошибку, просто возвращаем null если пользователь не авторизован
    userCache = null;
    cacheTimestamp = now;
    return null;
  }
};

export const deleteAppwriteSession = async () => {
  try {
    await account.deleteSession("current");
    // Очищаем кэш при выходе
    userCache = null;
    cacheTimestamp = 0;
  } catch (error) {
    console.error("Delete session error:", error);
  }
};

// Функция для очистки кэша при ошибках авторизации
export const clearUserCache = () => {
  userCache = null;
  cacheTimestamp = 0;
};
