import { createResource } from "@/utilities";

const AUTH_URL = import.meta.env.VITE_AUTH;

export const resetPassword = async (newPassword, token) => {
  try {
    const response = await createResource(`${AUTH_URL}/reset-password`, {
      password: newPassword,
      reset_password_token: token,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Unexpected response status.");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred during password reset"
    );
  }
};
