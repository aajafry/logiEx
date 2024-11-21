/* eslint-disable react/prop-types */
import {  LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { login } from "@/services";
import { Button } from "@/shadcn/components/ui/button";
import { Form } from "@/shadcn/components/ui/form";
import { loginSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginForm = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { reset, handleSubmit, control } = loginForm;

  const handleLoginSubmit = async (data) => {
    setLoading(true);
    try {
      const {
        token,
        message,
        user: { role: userRole },
      } = await login(data);
      localStorage.setItem("logiEx-token", token);
      toast.success(message);
      navigate(userRole ? `/${userRole}` : "/");
    } catch (error) {
      toast.error(
        error.message || "An error occurred while submitting the login"
      );
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-6">
        <InputField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email address."
        />

        <InputField
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password."
        />

        <Button
          type="button"
          variant="link"
          onClick={() => setOpen(true)}
          className="text-sm !mt-2 text-blue-600 cursor-pointer float-right"
        >
          Forgot Password?
        </Button>
        <LoadingButton type="submit" disabled={loading} label="Login" />
      </form>
    </Form>
  );
};
