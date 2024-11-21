/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { DateField, InputField, SelectField } from "@/molecules";
import { useEmployees, useShipments, useVehicles } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { Calendar } from "@/shadcn/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { cn } from "@/shadcn/lib/utils";
import { getUser } from "@/utilities";
import { createShipmentSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { shipmentStatusEnum as shipmentOptions } from "@/utilities";
import { LoadingButton } from "@/atoms";

export const CreateShipmentForm = ({ onAddShipment, onClose }) => {
  const { vehicles, getVehicles } = useVehicles();
  const { employees, getEmployees } = useEmployees();
  const { loading, getShipments, createShipment } = useShipments();

  const captainOptions = useMemo(
    () =>
      employees
        .filter((employee) => employee.role === "captain")
        .map((employee) => ({
          value: employee.id,
          label: `${employee.name} (${employee.email})`,
        })),
    [employees]
  );

  const vehicleOptions = useMemo(
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

  const createShipmentForm = useForm({
    resolver: zodResolver(createShipmentSchema),
  });

  const { reset, watch, handleSubmit, control } = createShipmentForm;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "orders",
  });

  const handleCreateShipmentSubmit = async (data) => {
    const formattedData = {
      ...data,
      shipment_date: data.shipment_date
        ? moment(data.shipment_date).toISOString()
        : moment().toISOString(),
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

  const { role } = getUser();

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
            placeholder="Enter Shipment ID."
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
                      <SelectValue placeholder="Select a captain..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {captainOptions.map((captain) => (
                      <SelectItem key={captain.value} value={captain.value}>
                        {captain.label}
                      </SelectItem>
                    ))}
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
                      <SelectValue placeholder="Select a vehicle..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleOptions.map((vehicle) => (
                      <SelectItem key={vehicle.value} value={vehicle.value}>
                        {vehicle.label}
                      </SelectItem>
                    ))}
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
                    {shipmentOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
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
          role
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
