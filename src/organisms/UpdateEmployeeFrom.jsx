/* eslint-disable react/prop-types */
import { AvatarField, InputField } from "@/molecules";
import { LoadingButton } from "@/atoms";
import { useEmployees } from "@/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { getUser, userRolesEnum } from "@/utilities";
import { updateEmployeeSchema } from "@/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { Loader2 } from "lucide-react";

export const UpdateEmployeeFrom = ({
  employeeId,
  onUpdateEmployee,
  onClose,
}) => {
  const [avatar, setAvatar] = useState(null);
  const { loading, getEmployees, getEmployee, updateEmployee } = useEmployees();

  const updateEmployeeFrom = useForm({
    resolver: zodResolver(updateEmployeeSchema),
  });
  const { reset, setValue, handleSubmit, control } = updateEmployeeFrom;

  const loadEmployeeData = useCallback(async () => {
    const employee = await getEmployee(employeeId);
    if (employee) {
      setAvatar(employee.avatar || "");
      Object.keys(employee).forEach((key) => {
        setValue(key, employee[key] || "");
      });
    }
  }, [employeeId, getEmployee, setValue]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  const handleUpdateEmployeeSubmit = async (data) => {
    const updatedEmployee = await updateEmployee(employeeId, {
      ...data,
      ...(avatar ? { avatar } : {}),
    });
    if (updatedEmployee) {
      onUpdateEmployee(updatedEmployee);
      reset();
      await getEmployees();
      onClose();
    }
  };

  let roleOptions = [];

  const { role } = getUser();

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
            avatar={avatar}
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
                          <SelectValue placeholder={`Select Employee Role.`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem
                            className="capitalize"
                            key={role}
                            value={role}
                          >
                            {role}
                          </SelectItem>
                        ))}
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
