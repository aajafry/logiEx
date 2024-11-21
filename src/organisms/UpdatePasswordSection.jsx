/* eslint-disable react/prop-types */
import { UpdatePasswordForm } from "./index.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";

export const UpdatePasswordSection = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Enter your new Password below.</DialogDescription>
        </DialogHeader>
        <UpdatePasswordForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
