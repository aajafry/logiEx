import { LoadingButton } from "@/atoms";
import { useVehicles } from "@/hooks";
import { IVehicle } from "@/interfaces";
import { InputField } from "@/molecules";
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
import { vehicleTypesEnum as vehicleOptions } from "@/utilities";
import { updateVehicleSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export const UpdateVehicleFrom = ({
  vehicleVIN,
  onUpdateVehicle,
  onClose,
}: {
  vehicleVIN: string;
  onUpdateVehicle: (vehicle: IVehicle) => void;
  onClose: () => void;
}) => {
  const { loading, getVehicles, getVehicle, updateVehicle } = useVehicles();

  const updateVehicleForm = useForm<IVehicle>({
    resolver: zodResolver(updateVehicleSchema),
  });
  const { reset, setValue, handleSubmit, control } = updateVehicleForm;

  const loadVehicleData = useCallback(async () => {
    const vehicle = await getVehicle(vehicleVIN);
    if (vehicle) {
      Object.keys(vehicle).forEach((key) => {
        setValue(key as keyof IVehicle, vehicle[key as keyof IVehicle] || "");
      });
    }
  }, [getVehicle, setValue, vehicleVIN]);

  useEffect(() => {
    loadVehicleData();
  }, [loadVehicleData]);

  const handleUpdateVehicleSubmit = async (data: IVehicle) => {
    const formattedData = {
      ...data,
      make: data.make.trim(),
      model: data.model?.trim(),
      year: data.year,
      color: data.color.trim(),
      mileage: data.mileage,
      engine_no: data.engine_no?.trim(),
      chassis_no: data.chassis_no?.trim(),
      vin: data.vin.trim(),
      plate_number: data.plate_number.trim(),
      cargo_capacity: data.cargo_capacity,
    };

    const updatedVehicle = await updateVehicle(vehicleVIN, formattedData);
    if (updatedVehicle) {
      onUpdateVehicle(updatedVehicle);
      reset();
      await getVehicles();
      onClose();
    }
  };

  return (
    <Form {...updateVehicleForm}>
      <form
        onSubmit={handleSubmit(handleUpdateVehicleSubmit)}
        className="space-y-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InputField
            control={control}
            name="make"
            label="Make"
            placeholder="Enter vehicle make."
          />

          <InputField
            control={control}
            name="model"
            label="Model"
            placeholder="Enter vehicle model."
          />

          <InputField
            control={control}
            name="year"
            label="Year"
            placeholder="Enter vehicle year."
          />

          <InputField
            control={control}
            name="color"
            label="Color"
            placeholder="Enter vehicle color."
          />

          <InputField
            control={control}
            name="mileage"
            label="Mileage"
            placeholder="Enter vehicle mileage."
          />

          <InputField
            control={control}
            name="engine_no"
            label="Engine No"
            placeholder="Enter vehicle engine no."
          />

          <InputField
            control={control}
            name="chassis_no"
            label="Chassis No"
            placeholder="Enter vehicle chassis no."
          />

          <InputField
            control={control}
            name="vin"
            label="VIN"
            placeholder="Enter vehicle VIN."
          />
          <InputField
            control={control}
            name="plate_number"
            label="Plate No"
            placeholder="Enter vehicle plate no."
          />

          <InputField
            control={control}
            name="cargo_capacity"
            label="Capacity"
            placeholder="Enter vehicle capacity."
          />

          <FormField
            control={control}
            name="type"
            render={({ field }) => {
              if (field.value) {
                return (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select a Vehicle Type...`}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-44 w-auto rounded-md border">
                          {vehicleOptions.map((type) => (
                            <SelectItem
                              className="capitalize"
                              key={type}
                              value={type}
                            >
                              {type}
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
                    <FormLabel>Vehicle Type</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
          />
        </div>

        <LoadingButton
          className="!mt-4"
          label="Update Vehicle"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
