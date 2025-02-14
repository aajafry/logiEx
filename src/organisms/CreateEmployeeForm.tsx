import { LoadingButton } from "@/atoms";
import { useEmployees } from "@/hooks";
import { IEmployee } from "@/interfaces";
import { AvatarField, InputField } from "@/molecules";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { getUser, userRolesEnum } from "@/utilities";
import { createEmployeeSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const CreateEmployeeForm = ({
  onClose,
  onAddEmployee,
}: {
  onClose: () => void;
  onAddEmployee: (employee: IEmployee) => void;
}) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const { loading, getEmployees, createEmployee } = useEmployees();

  const createEmployeeForm = useForm<IEmployee>({
    resolver: zodResolver(createEmployeeSchema),
  });
  const { reset, handleSubmit, control } = createEmployeeForm;

  const handleCreateEmployeeSubmit = async (data: IEmployee) => {
    const formattedData = {
      ...data,
      avatar: avatar || "",
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim(),
      role: data.role?.trim(),
      national_id: data.national_id?.trim(),
      driving_license_no: data.driving_license_no?.trim(),
      passport_no: data.passport_no?.trim(),
      address: data.address?.trim(),
    };

    const newEmployee = await createEmployee(formattedData);
    if (newEmployee) {
      onAddEmployee(newEmployee);
      reset();
      await getEmployees();
      onClose();
    }
  };

  let roleOptions: string[] = [];

  const user = getUser();
  const role = user?.role;

  if (role === "admin") {
    roleOptions = userRolesEnum;
  } else if (role === "fleet-manager") {
    roleOptions = ["captain"];
  } else if (role === "inventory-manager") {
    roleOptions = ["inventory-in-charge"];
  } else {
    roleOptions = [];
  }

  return (
    <Form {...createEmployeeForm}>
      <form
        onSubmit={handleSubmit(handleCreateEmployeeSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
          <AvatarField
            label="Employee Avatar"
            avatar={avatar || ""}
            setAvatar={setAvatar}
          />
          <InputField
            control={control}
            name="name"
            label="Name"
            placeholder="Enter employee name."
          />
          <InputField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter employee email address."
          />
          <InputField
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter employee password."
          />
          <InputField
            control={control}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter employee phone number."
          />

          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select Employee Role.`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-42 w-auto rounded-md border">
                      {roleOptions.map((role) => (
                        <SelectItem
                          className="capitalize"
                          key={role}
                          value={role}
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <InputField
            control={control}
            name="national_id"
            label="National ID"
            placeholder="Enter employee NID."
          />
          <InputField
            control={control}
            name="driving_license_no"
            label="Driving License No"
            placeholder="Enter employee Driving License No."
          />
          <InputField
            control={control}
            name="passport_no"
            label="Passport No"
            placeholder="Enter employee Passport No."
          />
        </div>
        <InputField
          control={control}
          name="address"
          label="Address"
          placeholder="Enter employee address."
        />
        <LoadingButton
          className="!mt-4"
          label="Create Employee"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
