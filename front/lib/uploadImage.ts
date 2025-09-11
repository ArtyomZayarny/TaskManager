import { ID, storage, account } from "@/appwrite";
import { Permission, Role } from "appwrite";

export const uploadImage = async (file: File) => {
  console.log("file", file);
  if (!file) return;

  try {
    // Попробуем создать анонимную сессию для загрузки
    try {
      await account.createAnonymousSession();
    } catch (e) {
      // Игнорируем ошибку если сессия уже существует
    }

    const fileUploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()), // публичное чтение
        Permission.write(Role.any()), // публичная запись
      ]
    );
    return fileUploaded;
  } catch (error) {
    console.error("Upload image error:", error);
    throw error;
  }
};
