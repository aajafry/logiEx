import { createResource } from "@/utilities";
import axios from "axios";

const AUTH_URL = import.meta.env.VITE_AUTH;


type PropsType = {
  name: string;
  email: string;
  password: string;
};

export const registration = async (data: PropsType) => {
  try {
    const response = await createResource(`${AUTH_URL}/register`, data);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response && (response.data as {message: string}).message);
    }
  } catch (error: unknown) {
    console.log(error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "An error occurred while trying to register an user."
    );
  }
};
