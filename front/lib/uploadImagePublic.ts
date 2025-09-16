import { ID, storage, client } from "@/appwrite";

export const uploadImagePublic = async (file: File) => {
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
    }

    const fileUploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file,
      []
    );
    return fileUploaded;
  } catch (error) {
    throw error;
  }
};
