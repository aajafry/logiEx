/* eslint-disable react/prop-types */
import { InputField, } from "@/molecules";
import { useVehicles } from "@/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { createVehicleSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vehicleTypesEnum as vehicleOptions } from "@/utilities";
import { LoadingButton } from "@/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";

export const CreateVehicleForm = ({ onAddVehicle, onClose }) => {
  const { loading, getVehicles, createVehicle } = useVehicles();
  const createVehicleForm = useForm({
    resolver: zodResolver(createVehicleSchema),
  });
  const { reset, handleSubmit, control } = createVehicleForm;

  const handleCreateVehicleSubmit = async (data) => {
    const newVehicle = await createVehicle(data);
    if (newVehicle) {
      onAddVehicle(newVehicle);
      reset();
      await getVehicles();
      onClose();
    }
  };

  return (
    <Form {...createVehicleForm}>
      <form
        onSubmit={handleSubmit(handleCreateVehicleSubmit)}
        className="space-y-6"
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select Vehicle Type.`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleOptions.map((type) => (
                      <SelectItem
                        className="capitalize"
                        key={type}
                        value={type}
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton
          className="!mt-4"
          label="Create Vehicle"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};