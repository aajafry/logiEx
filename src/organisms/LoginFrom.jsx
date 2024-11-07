/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { login } from "@/services";
import { Button } from "@/shadcn/components/ui/button";
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
import { TabsContent } from "@/shadcn/components/ui/tabs";
import { loginSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginFrom = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

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
      loginForm.reset();
      setLoading(false);
    }
  };
  return (
    <TabsContent value="login">
      <Card>
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
            className="space-y-2"
          >
            <CardHeader>
              <CardTitle>Login to Your Account</CardTitle>
              <CardDescription>
                Enter your login credentials below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* forgot password */}
              <Button
                type="button"
                variant="link"
                onClick={() => setOpen(true)}
                className="text-sm text-blue-600 cursor-pointer float-right"
              >
                Forgot Password?
              </Button>
            </CardContent>
            <CardFooter>
              <LoadingButton type="submit" disabled={loading} label="Login" />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  );
};
