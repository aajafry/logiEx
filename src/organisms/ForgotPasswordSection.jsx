/* eslint-disable react/prop-types */
import { ForgotPasswordForm } from "./index.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";

export const ForgotPasswordSection = ({ open, setOpen }) => {
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
