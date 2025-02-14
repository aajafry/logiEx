import { toast } from "sonner";
import { deleteFromCloudinary, uploadToCloudinary } from "./index";

type HandleAvatarChangeType = (
  event: React.ChangeEvent<HTMLInputElement>,
  avatar: string | null,
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>
) => Promise<void>;

export const handleAvatarChange: HandleAvatarChangeType = async (
  event: React.ChangeEvent<HTMLInputElement>,
  avatar: string | null,
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
  try {
    // Delete the existing avatar if it exists
    if (avatar) {
      const publicId = avatar.split("/").pop()?.split(".")[0];
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
      setAvatar(null);
    }

    // Upload the new avatar
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file, "logiEx");
      if (imageUrl) {
        setAvatar(imageUrl);
        toast.success("New avatar uploaded successfully.");
      }
    }
  } catch (error) {
    console.error("Error handling avatar change:", error);
    toast.error("Failed to update avatar");
  }
};
