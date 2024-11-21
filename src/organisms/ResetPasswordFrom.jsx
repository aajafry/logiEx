/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { resetPassword } from "@/services";
import { Form } from "@/shadcn/components/ui/form";
import { resetPasswordSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ResetPasswordFrom = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { reset, handleSubmit, control } = resetPasswordForm;

  const handleResetPasswordSubmit = async (data) => {
    const { newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not matches, please check your passwords and try again."
      );
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(newPassword, token);
      toast.success(result.message);
      localStorage.removeItem("logiEx-token");
      navigate("/authentication", { replace: true });
    } catch (error) {
      toast.error(
        error.message || "An error occurred while submitting the reset password"
      );
    } finally {
      reset();
      setLoading(false);
    }
  };
  return (
    <Form {...resetPasswordForm}>
      <form
        onSubmit={handleSubmit(handleResetPasswordSubmit)}
        className="space-y-6"
      >
        <InputField
          control={control}
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password."
        />

        <InputField
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Enter your confirm password."
        />

        <LoadingButton
          type="submit"
          label="Reset Password"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
