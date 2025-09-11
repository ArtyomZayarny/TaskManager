import { ID, storage } from "@/appwrite";

export const uploadImagePublic = async (file: File) => {
  console.log("file", file);
  if (!file) return;

  try {
    // Для публичного bucket без авторизации
    const fileUploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file,
      [], // пустой массив разрешений = публичный доступ
      [], // пустой массив для дополнительных разрешений
      false // не требовать авторизацию
    );
    return fileUploaded;
  } catch (error) {
    console.error("Upload image error:", error);
    throw error;
  }
};
