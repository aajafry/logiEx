import axios from "axios";

const AUTH_URL = import.meta.env.VITE_AUTH;

export const login = async (data) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Unexpected response status.");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred while trying to login."
    );
  }
};