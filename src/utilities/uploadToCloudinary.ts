import axios from "axios";
import { toast } from "sonner";

const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

type uploadToCloudinaryType = (
  file: File,
  folder: string
) => Promise<string | null>;

// helper function to upload images to Cloudinary
export const uploadToCloudinary: uploadToCloudinaryType = async(
  file: File,
  folder: string
): Promise<string | null> => {
  // only image are allowed
  if (!file.type.startsWith("image/")) {
    toast.error("Only image files are allowed.");
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    toast.error("Image size should be less than 5MB.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);
  formData.append("folder", folder);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );
    // Ensure the response data has the secure_url property
    if (response.data?.secure_url) {
      return response.data.secure_url;
    } else {
      toast.error("Failed to get secure URL from Cloudinary.");
      return null;
    }
  } catch (error: unknown) {
    console.error(error);
    toast.error("Error uploading image to Cloudinary.");
    return null;
  }
};
