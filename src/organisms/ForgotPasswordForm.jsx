/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { forgotPassword } from "@/services";
import { Form } from "@/shadcn/components/ui/form";
import { forgotPasswordSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const ForgotPasswordForm = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { reset, handleSubmit, control } = forgotPasswordForm;

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
      reset();
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Form {...forgotPasswordForm}>
      <form
        onSubmit={handleSubmit(handleForgotPasswordSubmit)}
        className="space-y-6"
      >
        <InputField
          control={control}
          name="email"
          label="Email"
          placeholder="Enter Email address here."
        />

        <LoadingButton
          type="submit"
          size="sm"
          disabled={loading}
          label="Send Reset Link"
        />
      </form>
    </Form>
  );
};
