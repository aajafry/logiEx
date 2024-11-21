/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { Form } from "@/shadcn/components/ui/form";
import { getUser } from "@/utilities";
import { resetPasswordSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const USERS_URL = import.meta.env.VITE_USERS;

export const UpdatePasswordForm = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { id: userId } = getUser();
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
      const result = await axios.put(
        `${USERS_URL}/${userId}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("logiEx-token")}`,
          },
        }
      );
      if (result.status === 200) {
        toast.success(result.data.message || "Password updated successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while submitting the reset password"
      );
    } finally {
      setLoading(false);
      reset();
      setOpen(false);
    }
  };
  return (
    <Form {...resetPasswordForm}>
      <form
        onSubmit={handleSubmit(handleResetPasswordSubmit)}
        className="space-y-4"
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
          size="sm"
          label="Reset Password"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
