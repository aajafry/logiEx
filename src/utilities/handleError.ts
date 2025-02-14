import { toast } from "sonner";

// Helper function to handle API errors
interface ErrorWithMessage {
  message: string;
}

export const handleError = (error: unknown, defaultMessage: string) => {
  const message = (error as ErrorWithMessage).message || defaultMessage;
  toast.error(message);
  console.error(message, error);
};
