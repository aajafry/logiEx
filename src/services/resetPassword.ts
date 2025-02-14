import { createResource } from "@/utilities";
import axios from "axios";

const AUTH_URL = import.meta.env.VITE_AUTH;

export const resetPassword = async (newPassword: string, token: string) => {
  try {
    const response = await createResource(`${AUTH_URL}/reset-password`, {
      password: newPassword,
      reset_password_token: token,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        (response && (response.data as { message: string }).message) ||
          "Unexpected response status."
      );
    }
  } catch (error: unknown) {
    console.error(error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "An error occurred during password reset."
    );
  }
};
