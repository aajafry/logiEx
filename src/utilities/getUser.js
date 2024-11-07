import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const getUser = () => {
  const token = localStorage.getItem("logiEx-token");
  if (!token) {
    toast.error("No token found");
    return null;
  }

  try {
    const user = jwtDecode(token);
    return user;
  } catch (error) {
    toast.error(`Error decoding token: ${error.message}`);
    return null;
  }
};
