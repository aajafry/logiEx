import { useTokenVerification } from "@/hooks";
import { LoadingButton } from "@/atoms";
import { resetPassword } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { resetPasswordSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  useTokenVerification(token);

  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

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
      resetPasswordForm.reset();
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh flex items-center justify-center">
      <Card className="w-[400px]">
        <Form {...resetPasswordForm}>
          <form
            onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)}
            className="space-y-2"
          >
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter your new Password below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={resetPasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <LoadingButton
                type="submit"
                label="Reset Password"
                disabled={loading}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
