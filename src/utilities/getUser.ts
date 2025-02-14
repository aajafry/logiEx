import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { getToken } from "./index";

type DecodedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export const getUser = (): DecodedUser | null => {
  const token = getToken();
  if (!token) {
    toast.error("No token found");
    return null;
  }

  try {
    const user: DecodedUser = jwtDecode<DecodedUser>(token);
    return user;
  } catch (error: unknown) {
    console.error("Error decoding token:", error);

    toast.error(
      error instanceof Error
        ? `Error decoding token: ${error.message}`
        : "Invalid token format"
    );
    return null;
  }
};
