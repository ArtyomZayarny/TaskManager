import { ID, storage, client, account } from "@/appwrite";

export const uploadImagePublic = async (file: File) => {
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
      []
    );
    return fileUploaded;
  } catch (error) {
    throw error;
  }
};
