import { ID, storage, account, client } from "@/appwrite";
import { Permission, Role } from "appwrite";

export const uploadImage = async (file: File) => {
  if (!file) return;

  try {
    // Создаем анонимную сессию для загрузки файлов
    try {
      await account.createAnonymousSession();
    } catch (e) {
      // Игнорируем ошибки, если сессия уже существует
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
