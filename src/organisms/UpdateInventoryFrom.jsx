/* eslint-disable react/prop-types */
import { InputField, TextareaField } from "@/molecules";
import { useInventories } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import { updateInventorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/atoms";

export const UpdateInventoryFrom = ({
  inventoryName,
  onUpdateInventory,
  onClose,
}) => {
  const { loading, getInventory, getInventories, updateInventory } =
    useInventories();

  const updateInventoryFrom = useForm({
    resolver: zodResolver(updateInventorySchema),
  });
  const { reset, setValue, handleSubmit, control } = updateInventoryFrom;

  const loadInventoryData = useCallback(async () => {
    const inventory = await getInventory(inventoryName);
    if (inventory) {
      Object.keys(inventory).forEach((key) => {
        setValue(key, inventory[key] || "");
      });
    }
  }, [getInventory, inventoryName, setValue]);

  useEffect(() => {
    loadInventoryData();
  }, [loadInventoryData]);

  const handleUpdateInventorySubmit = async (data) => {
    const updatedInventory = await updateInventory(inventoryName, data);
    if (updatedInventory) {
      onUpdateInventory(updatedInventory);
      reset();
      await getInventories();
      onClose();
    }
  };

  return (
    <Form {...updateInventoryFrom}>
      <form
        onSubmit={handleSubmit(handleUpdateInventorySubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1">
          <InputField
            control={control}
            name="name"
            label="Inventory Name"
            placeholder="Enter inventory name."
          />
          <InputField
            control={control}
            name="email"
            label="Inventory Email"
            type="email"
            placeholder="Enter inventory email address."
          />
          <InputField
            control={control}
            name="phone"
            label="Inventory Phone"
            type="tel"
            placeholder="Enter inventory phone number."
          />
          <InputField
            control={control}
            name="address"
            label="Inventory Address"
            placeholder="Type inventory address here."
          />
          <TextareaField
            control={control}
            name="description"
            label="Inventory Description"
            placeholder="Enter inventory description here."
          />
        </div>
        <LoadingButton
          className="!mt-4"
          label="Update Inventory"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
