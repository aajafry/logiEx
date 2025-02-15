import { DateField, LoadingButton } from "@/atoms";
import { useEmployees, useShipments, useVehicles } from "@/hooks";
import { IShipment } from "@/interfaces";
import { InputField } from "@/molecules";
import { Button } from "@/shadcn/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { getUser, shipmentStatusEnum as shipmentOptions } from "@/utilities";
import { createShipmentSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const CreateShipmentForm = ({
  onAddShipment,
  onClose,
}: {
  onAddShipment: (shipment: IShipment) => void;
  onClose: () => void;
}) => {
  const { vehicles, getVehicles } = useVehicles();
  const { employees, getEmployees } = useEmployees();
  const { loading, getShipments, createShipment } = useShipments();

  const captainOptions: {
    value: string;
    label: string;
  }[] = useMemo(
    () =>
      employees
        .filter((employee) => employee.role === "captain")
        .map((employee) => ({
          value: employee.id,
          label: `${employee.name} (${employee.email})`,
        })),
    [employees]
  );

  const vehicleOptions: {
    value: string;
    label: string;
  }[] = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        value: vehicle.vin,
        label: `${vehicle.make} ${vehicle.model} ${vehicle.year} (${vehicle.vin})`,
      })),
    [vehicles]
  );

  const loadVehicles = useCallback(
    async () => await getVehicles(),
    [getVehicles]
  );
  const loadEmployees = useCallback(
    async () => await getEmployees(),
    [getEmployees]
  );

  useEffect(() => {
    loadVehicles();
    loadEmployees();
  }, [loadEmployees, loadVehicles]);

  const createShipmentForm = useForm<IShipment>({
    resolver: zodResolver(createShipmentSchema),
  });

  const { reset, handleSubmit, control } = createShipmentForm;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "orders",
  });

  const handleCreateShipmentSubmit = async (data: IShipment) => {
    const formattedData = {
      ...data,
      shipment_id: data.shipment_id.trim(),
      shipment_date: data.shipment_date
        ? moment(data.shipment_date).toISOString()
        : moment().toISOString(),
      captain_id: data.captain_id.trim(),
      vehicle_vin: data.vehicle_vin.trim(),
      status: data.status ? data.status : "pending",
      orders: data.orders?.length === 0 ? null : data.orders,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    const newShipment = await createShipment(validData);
    if (newShipment) {
      onAddShipment(newShipment);
      reset();
      await getShipments();
      onClose();
    }
  };

  const user = getUser();
  const role = user?.role;

  return (
    <Form {...createShipmentForm}>
      <form
        onSubmit={handleSubmit(handleCreateShipmentSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            control={control}
            name="shipment_id"
            label="Shipment ID"
            placeholder="Enter Shipment ID"
          />

          <DateField
            control={control}
            name="shipment_date"
            label="Date of Shipment"
          />
          <FormField
            control={control}
            name="captain_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Captain</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Captain..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {captainOptions.map((captain) => (
                        <SelectItem key={captain.value} value={captain.value}>
                          {captain.label}
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
            name="vehicle_vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Vehicle..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {vehicleOptions.map((vehicle) => (
                        <SelectItem key={vehicle.value} value={vehicle.value}>
                          {vehicle.label}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Status..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {shipmentOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
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

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <FormField
                control={control}
                name={`orders.${index}.bill_id`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Bill ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="BILL-2024-000"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="sm"
                type="button"
                variant="destructive"
                className="w-fit"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {["admin", "inventory-manager", "inventory-in-charge"].includes(
          role!
        ) && (
          <Button
            className="bg-emerald-500 hover:bg-emerald-400"
            type="button"
            size="sm"
            onClick={() =>
              append({
                bill_id: "",
              })
            }
          >
            Add Item
          </Button>
        )}
        <br />
        <LoadingButton
          className="!mt-4"
          label="Create Shipment"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
