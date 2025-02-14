import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { ForgotPasswordForm } from "./index";

export const ForgotPasswordSection = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email to receive a password reset link.
          </DialogDescription>
        </DialogHeader>
        <ForgotPasswordForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
