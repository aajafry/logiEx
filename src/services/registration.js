import { createResource } from "@/utilities";

const AUTH_URL = import.meta.env.VITE_AUTH;

export const registration = async (data) => {
  try {
    const response = await createResource(`${AUTH_URL}/register`, data)
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred while trying to register an user"
    );
  }
};
