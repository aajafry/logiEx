import { DateField, LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { useEmployees, useShipments, useVehicles } from "@/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { getUser } from "@/utilities";
import { updateShipmentSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { shipmentStatusEnum as shipmentOptions } from "@/utilities";
import { IShipment } from "@/interfaces";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

export const UpdateShipmentFrom = ({
  shipmentId,
  onUpdateShipment,
  onClose,
}: {
  shipmentId: string;
  onUpdateShipment: (shipment: IShipment) => void;
  onClose: () => void;
}) => {
  const {
    loading,
    getShipment,
    getShipments,
    updateShipment,
    deleteSaleProduct,
  } = useShipments();
  const { employees, getEmployees } = useEmployees();
  const { vehicles, getVehicles } = useVehicles();

  const updateShipmentForm = useForm<IShipment>({
    resolver: zodResolver(updateShipmentSchema),
  });

  const { reset, setValue, getValues, control, handleSubmit } =
    updateShipmentForm;

  const loadShipmentData = useCallback(async () => {
    const shipment = await getShipment(shipmentId);
    if (shipment) {
      setValue("shipment_id", shipment.shipment_id || "");
      setValue("shipment_date", shipment.shipment_date || "");
      setValue("captain_id", shipment?.captain?.id || "");
      setValue("vehicle_vin", shipment?.vehicle?.vin || "");
      setValue("status", shipment.status || "");
      setValue("existingItems", shipment.items || []);
    }
  }, [getShipment, setValue, shipmentId]);

  const loadEmployees = useCallback(
    async () => await getEmployees(),
    [getEmployees]
  );
  const loadVehicles = useCallback(
    async () => await getVehicles(),
    [getVehicles]
  );

  useEffect(() => {
    loadShipmentData();
    loadEmployees();
    loadVehicles();
  }, [loadEmployees, loadShipmentData, loadVehicles]);

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

  const { fields: existingItemsFields, remove: removeExistingField } =
    useFieldArray({
      control,
      name: "existingItems",
    });

  const {
    fields: newItemFields,
    append: appendNewItem,
    remove: removeNewItem,
  } = useFieldArray({
    control,
    name: "orders",
  });

  const handleRemoveExistingItem = async (index: number) => {
    const productId = getValues(`existingItems.${index}.id`);
    const deletedPurchaseProduct = await deleteSaleProduct(productId);
    if (deletedPurchaseProduct) {
      removeExistingField(index);
    }
  };

  const handleUpdateShipmentSubmit = async (data: IShipment) => {
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
    const updatedShipment = await updateShipment(shipmentId, validData);
    if (updatedShipment) {
      onUpdateShipment(updatedShipment);
      reset();
      await getShipments();
      onClose();
    }
  };

  const user = getUser();
  const role = user?.role;

  return (
    <Form {...updateShipmentForm}>
      <form
        onSubmit={handleSubmit(handleUpdateShipmentSubmit)}
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
            render={({ field }) => {
              if (field.value) {
                return (
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
                            <SelectItem
                              key={captain.value}
                              value={captain.value}
                            >
                              {captain.label}
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
                    <FormLabel>Captain</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
          />

          <FormField
            control={control}
            name="vehicle_vin"
            render={({ field }) => {
              if (field.value) {
                return (
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
                            <SelectItem
                              key={vehicle.value}
                              value={vehicle.value}
                            >
                              {vehicle.label}
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
                    <FormLabel>Vehicle</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
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
                      <SelectValue placeholder={`Select a Status...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {shipmentOptions.map((status) => (
                        <SelectItem
                          className="capitalize"
                          key={status}
                          value={status}
                        >
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
          {existingItemsFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <FormField
                control={control}
                name={`existingItems.${index}.bill_id`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Bill ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="BILL-2024-000"
                        autoComplete="off"
                        disabled={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role &&
                ["admin", "inventory-manager", "inventory-in-charge"].includes(
                  role
                ) && (
                  <LoadingButton
                    size="sm"
                    type="button"
                    label="Remove"
                    disabled={loading}
                    variant="destructive"
                    className="w-fit"
                    onClick={() => handleRemoveExistingItem(index)}
                  />
                )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {newItemFields.map((field, index) => (
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
                onClick={() => removeNewItem(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {role &&
          ["admin", "inventory-manager", "inventory-in-charge"].includes(
            role
          ) && (
            <Button
              className="bg-emerald-500 hover:bg-emerald-400"
              type="button"
              size="sm"
              onClick={() =>
                appendNewItem({
                  bill_id: "",
                })
              }
            >
              Add Item
            </Button>
          )}
        <br />
        {role &&
          [
            "admin",
            "fleet-manager",
            "inventory-manager",
            "inventory-in-charge",
          ].includes(role) && (
            <LoadingButton
              className="!mt-4 bg-blue-500 hover:bg-blue-400"
              label="Update Shipment"
              size="sm"
              disabled={loading}
            />
          )}
      </form>
    </Form>
  );
};
