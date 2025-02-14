import { LoadingButton } from "@/atoms";
import { useInventories } from "@/hooks";
import { IInventory } from "@/interfaces";
import { InputField, TextareaField } from "@/molecules";
import { Form } from "@/shadcn/components/ui/form";
import { createInventorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const CreateInventoryForm = ({
  onAddInventory,
  onClose,
}: {
  onAddInventory: (inventory: IInventory) => void;
  onClose: () => void;
}) => {
  const { loading, getInventories, createInventory } = useInventories();

  const createInventoryForm = useForm<IInventory>({
    resolver: zodResolver(createInventorySchema),
  });
  const { reset, handleSubmit, control } = createInventoryForm;

  const handleCreateInventorySubmit = async (data: IInventory) => {
    
    const formattedData = {
      ...data,
      name: data.name.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      address: data.address.trim(),
      description: data.description?.trim(),
    };
    
    const newInventory = await createInventory(formattedData);
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
