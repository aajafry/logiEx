/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { forgotPassword } from "@/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { forgotPasswordSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const ForgotPasswordForm = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleForgotPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await forgotPassword(data);
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while send reset password to email"
      );
    } finally {
      forgotPasswordForm.reset();
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email to receive a password reset link.
          </DialogDescription>
        </DialogHeader>
        <Form {...forgotPasswordForm}>
          <form
            onSubmit={forgotPasswordForm.handleSubmit(
              handleForgotPasswordSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="pedro@gmail.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type="submit"
              size="sm"
              disabled={loading}
              label="Send Reset Link"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
