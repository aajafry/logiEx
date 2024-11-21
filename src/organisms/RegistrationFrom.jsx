import { LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { registration } from "@/services";
import { Form } from "@/shadcn/components/ui/form";
import { registrationSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const RegistrationFrom = () => {
  const [loading, setLoading] = useState(false);
  const registrationForm = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const { reset, handleSubmit, control } = registrationForm;

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
      reset();
      setLoading(false);
    }
  };

  return (
    <Form {...registrationForm}>
      <form
        onSubmit={handleSubmit(handleRegistrationSubmit)}
        className="space-y-6"
      >
        <InputField
          control={control}
          name="name"
          label="Name"
          placeholder="Enter your name."
        />

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

        <LoadingButton type="submit" disabled={loading} label="Register" />
      </form>
    </Form>
  );
};
