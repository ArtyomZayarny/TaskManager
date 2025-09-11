import { storage } from "@/appwrite";
import { Image } from "@/types";

export const getUrl = async (image: Image | undefined) => {
  if (!image) return;
  if (image) {
    try {
      const url = storage.getFileView(image.bucketId, image.fileId);
      return url;
    } catch (error) {
      return null;
    }
  }
};
