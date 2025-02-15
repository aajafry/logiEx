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
import { updateEmployeeSchema } from "@/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const UpdateEmployeeFrom = ({
  employeeId,
  onUpdateEmployee,
  onClose,
}: {
  employeeId: string;
  onUpdateEmployee: (employee: IEmployee) => void;
  onClose: () => void;
}) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const { loading, getEmployees, getEmployee, updateEmployee } = useEmployees();

  const updateEmployeeFrom = useForm<IEmployee>({
    resolver: zodResolver(updateEmployeeSchema),
  });
  const { reset, setValue, handleSubmit, control } = updateEmployeeFrom;

  const loadEmployeeData = useCallback(async () => {
    const employee = await getEmployee(employeeId);
    if (employee) {
      setAvatar(employee.avatar || "");
      Object.keys(employee).forEach((key) => {
        setValue(
          key as keyof IEmployee,
          employee[key as keyof IEmployee] || ""
        );
      });
    }
  }, [employeeId, getEmployee, setValue]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  const handleUpdateEmployeeSubmit = async (data: IEmployee) => {
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

    const updatedEmployee = await updateEmployee(employeeId, formattedData);
    if (updatedEmployee) {
      onUpdateEmployee(updatedEmployee);
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
    <Form {...updateEmployeeFrom}>
      <form
        onSubmit={handleSubmit(handleUpdateEmployeeSubmit)}
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
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter employee phone number."
          />

          <FormField
            control={control}
            name="role"
            render={({ field }) => {
              if (field.value) {
                return (
                  <FormItem>
                    <FormLabel>Employee Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Employee Role..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-44 w-auto rounded-md border">
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
                );
              } else {
                return (
                  <FormItem>
                    <FormLabel>Employee Role</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
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
          label="Update Employee"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
