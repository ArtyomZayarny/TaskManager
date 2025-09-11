import { storage } from "@/appwrite";

export const getUrl = async (image: Image | undefined) => {
  if (!image) return;
  if (image) {
    try {
      const url = storage.getFileView(image.bucketId, image.fileId);
      return url;
    } catch (error) {
      console.error("Error getting file URL:", error);
      return null;
    }
  }
};
