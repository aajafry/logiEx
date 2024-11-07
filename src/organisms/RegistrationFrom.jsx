import { LoadingButton } from "@/atoms";
import { registration } from "@/services";
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
import { registrationSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const RegistrationFrom = () => {
  const [loading, setLoading] = useState(false);
  const registrationForm = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleRegistrationSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registration(data);
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while submitting the registration"
      );
    } finally {
      registrationForm.reset();
      setLoading(false);
    }
  };
  return (
    <TabsContent value="registration">
      <Card>
        <Form {...registrationForm}>
          <form
            onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)}
            className="space-y-2"
          >
            <CardHeader>
              <CardTitle>Create a New Account</CardTitle>
              <CardDescription>
                Fill in the details to register.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={registrationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Pedro Duarte"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registrationForm.control}
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
                control={registrationForm.control}
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
            </CardContent>
            <CardFooter>
              <LoadingButton
                type="submit"
                disabled={loading}
                label="Register"
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  );
};
