/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useInventories } from "@/hooks";
import { InputField, TextareaField } from "@/molecules";
import { Form } from "@/shadcn/components/ui/form";
import { createInventorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const CreateInventoryForm = ({ onAddInventory, onClose }) => {
  const { loading, getInventories, createInventory } = useInventories();

  const createInventoryForm = useForm({
    resolver: zodResolver(createInventorySchema),
  });
  const { reset, handleSubmit, control } = createInventoryForm;

  const handleCreateInventorySubmit = async (data) => {
    const newInventory = await createInventory(data);
    if (newInventory) {
      onAddInventory(newInventory);
      reset();
      await getInventories();
      onClose();
    }
  };

  return (
    <Form {...createInventoryForm}>
      <form
        onSubmit={handleSubmit(handleCreateInventorySubmit)}
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
          label="Create Inventory"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
