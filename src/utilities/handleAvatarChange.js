import { toast } from "react-toastify";
import { uploadToCloudinary, deleteFromCloudinary } from "./index.js";

export const handleAvatarChange = async (event, avatar, setAvatar) => {
  if (event && avatar) {
    const publicId = avatar.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
    setAvatar(null);
  }
  const file = event.target.files[0];
  if (file) {
    const imageUrl = await uploadToCloudinary(file, "logiEx");
    if (imageUrl) {
      setAvatar(imageUrl);
      toast.success("New avatar was added");
    }
  }
};
