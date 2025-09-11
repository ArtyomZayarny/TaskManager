import { ID, storage } from "@/appwrite";

export const uploadImagePublic = async (file: File) => {
  if (!file) return;

  try {
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
