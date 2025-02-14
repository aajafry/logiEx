import { AvatarField, InputField } from "@/molecules";
import { useEmployees } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import { getUser } from "@/utilities";
import { updateEmployeeSchema } from "@/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/atoms";
import { IEmployee } from "@/interfaces";

export const UpdateProfileForm = () => {
  const [avatar, setAvatar] = useState<string | null>("");
  const user = getUser();
  const userId = user?.id;
  const { loading, getEmployee, updateEmployee } = useEmployees();

  const updateProfileForm = useForm<IEmployee>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  const { reset, setValue, handleSubmit, control } = updateProfileForm;

  const loadUserData = useCallback(async () => {
    if (!userId) return;
    const user = await getEmployee(userId);
    if (user) {
      setAvatar(user.avatar || "");
      Object.keys(user).forEach((key) => {
        setValue(key as keyof IEmployee, user[key as keyof IEmployee] || "");
      });
    }
  }, [getEmployee, setValue, userId]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleupdateProfileSubmit = async (data: IEmployee) => {
    if (!userId) return;
    const updatedProfile = await updateEmployee(userId, {
      ...data,
      ...(avatar ? { avatar } : {}),
    });
    if (updatedProfile) {
      reset();
      loadUserData();
    }
  };

  return (
    <Form {...updateProfileForm}>
      <form
        onSubmit={handleSubmit(handleupdateProfileSubmit)}
        className="space-y-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <AvatarField
            label="Employee Avatar"
            avatar={avatar || ""}
            setAvatar={setAvatar}
          />

          <InputField
            control={control}
            name="name"
            label="Name"
            placeholder="Enter Your name here."
          />
          <InputField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter Your email address here."
          />
          <InputField
            control={control}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter Your phone number here."
          />

          <InputField
            control={control}
            name="role"
            label="Role"
            disabled={true}
            placeholder="Enter your role here."
          />
          <InputField
            control={control}
            name="national_id"
            label="National ID"
            placeholder="Enter your NID."
          />
          <InputField
            control={control}
            name="driving_license_no"
            label="Driving License No"
            placeholder="Enter your Driving License No."
          />
          <InputField
            control={control}
            name="passport_no"
            label="Passport No"
            placeholder="Enter your Passport No."
          />
        </div>
        <InputField
          control={control}
          name="address"
          label="Address"
          placeholder="Enter your address."
        />

        <LoadingButton
          className="!mt-4"
          label="Update Profile"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
