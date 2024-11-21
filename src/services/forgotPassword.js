import { createResource } from "@/utilities";

const AUTH_URL = import.meta.env.VITE_AUTH;

export const forgotPassword = async (data) => {
  try {
    const response = await createResource(
      `${AUTH_URL}/request-password-reset`,
      data
    );
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Unexpected response status.");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred while sending reset password to email."
    );
  }
};
