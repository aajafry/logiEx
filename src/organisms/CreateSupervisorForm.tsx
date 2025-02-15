import { DateField, LoadingButton } from "@/atoms";
import { useEmployees, useInventories, useSupervisors } from "@/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { createInventoryEmploymentSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { ISupervisor } from "@/interfaces";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

export const CreateSupervisorForm = ({
  onAddSupervisor,
  onClose,
}: {
  onAddSupervisor: (supervisor: ISupervisor) => void;
  onClose: () => void;
}) => {
  const { loading, getSupervisors, createSupervisor } = useSupervisors();
  const { inventories, getInventories } = useInventories();
  const { employees, getEmployees } = useEmployees();

  const inventoriesOptions: { value: string; label: string }[] = useMemo(
    () =>
      inventories.map((inventory) => ({
        value: inventory.id,
        label: inventory.name,
      })),
    [inventories]
  );

  const employeesOptions: {
    value: string;
    label: string;
  }[] = useMemo(
    () =>
      employees
        .filter((employee) => employee.role === "inventory-in-charge")
        .map((employee) => ({ value: employee.id, label: employee.name })),
    [employees]
  );

  const loadEmployees = useCallback(
    async () => await getEmployees(),
    [getEmployees]
  );
  const loadInventories = useCallback(
    async () => await getInventories(),
    [getInventories]
  );

  useEffect(() => {
    loadEmployees();
    loadInventories();
  }, [loadEmployees, loadInventories]);

  const createSupervisorForm = useForm<ISupervisor>({
    resolver: zodResolver(createInventoryEmploymentSchema),
  });
  const { reset, handleSubmit, control } = createSupervisorForm;

  const handleCreateSupervisorSubmit = async (data: ISupervisor) => {
    const formattedData = {
      ...data,
      hire_date: data.hire_date
        ? moment(data.hire_date).toISOString()
        : moment().toISOString(),
      employee_id: data.employee_id.trim(),
      inventory: data.inventory.trim(),
    };

    const newProduct = await createSupervisor(formattedData);
    if (newProduct) {
      onAddSupervisor(newProduct);
      reset();
      await getSupervisors();
      onClose();
    }
  };

  return (
    <Form {...createSupervisorForm}>
      <form
        onSubmit={handleSubmit(handleCreateSupervisorSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1">
          <DateField control={control} name="hire_date" label="Date of Hire" />
          <FormField
            control={control}
            name="employee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a Supervisor...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {employeesOptions.map((employee) => (
                        <SelectItem
                          className="capitalize"
                          key={employee?.value}
                          value={employee?.value}
                        >
                          {employee?.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select an Inventory...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {inventoriesOptions.map((inventory) => (
                        <SelectItem
                          className="capitalize"
                          key={inventory?.value}
                          value={inventory?.label}
                        >
                          {inventory?.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton
          className="!mt-4"
          label="Create Supervisor"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
