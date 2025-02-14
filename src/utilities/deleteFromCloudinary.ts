import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";

type deleteFromCloudinaryType = <Res>(
  publicId: string
) => Promise<AxiosResponse<Res> | void>;

// helper function to delete images from Cloudinary
export const deleteFromCloudinary: deleteFromCloudinaryType = async <Res>(
  publicId: string
): Promise<AxiosResponse<Res> | void> => {
  try {
    const response: AxiosResponse<Res> = await axios.post(
      `${import.meta.env.VITE_CLOUDINARY}/delete-image`,
      { publicId: `logiEx/${publicId}` },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("logiEx-token")}`,
        },
      }
    );
    return response;
  } catch (error: unknown) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Error removing image from Cloudinary."
      );
    } else if (error instanceof Error) {
      toast.error("error removing image from cloudinary.");
    } else {
      toast.error("error removing image from cloudinary.");
    }
  }
};
