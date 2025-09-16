import { ID, storage, account, client } from "@/appwrite";
import { Permission, Role } from "appwrite";

export const uploadImage = async (file: File) => {
  if (!file) return;

  try {
    // Получаем токен для авторизации в Appwrite
    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("access_token") || "null")
        : null;

    if (token) {
      // Устанавливаем JWT токен для клиента Appwrite
      client.setJWT(token);
    } else {
      // Если токена нет, создаем анонимную сессию
      try {
        await account.createAnonymousSession();
      } catch (e) {}
    }

    const fileUploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file,
      [Permission.read(Role.any()), Permission.write(Role.any())]
    );
    return fileUploaded;
  } catch (error) {
    throw error;
  }
};
