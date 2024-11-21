import { createResource } from "@/utilities";

const AUTH_URL = import.meta.env.VITE_AUTH;

export const logout = async (userId) => {
  try {
    const response = await createResource(`${AUTH_URL}/logout/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Unexpected response status.");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred while trying to logout"
    );
  }
};
