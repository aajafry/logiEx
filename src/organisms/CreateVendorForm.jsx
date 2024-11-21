/* eslint-disable react/prop-types */
import { InputField, } from "@/molecules";
import { useVendors } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import { createVendorSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/atoms";

export const CreateVendorForm = ({ onAddVendor, onClose }) => {
  const { loading, getVendors, createVendor } = useVendors();

  const createVendorForm = useForm({
    resolver: zodResolver(createVendorSchema),
  });
  const { reset, handleSubmit, control } = createVendorForm;

  const handleCreateVendorSubmit = async (data) => {
    const newVendor = await createVendor(data);
    if (newVendor) {
      onAddVendor(newVendor);
      reset();
      await getVendors();
      onClose();
    }
  };

  return (
    <Form {...createVendorForm}>
      <form
        onSubmit={handleSubmit(handleCreateVendorSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1">
          <InputField
            control={control}
            name="name"
            label="Name"
            placeholder="Enter vendor name."
          />
          <InputField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter vendor email address."
          />

          <InputField
            control={control}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter vendor phone number."
          />

          <InputField
            control={control}
            name="address"
            label="Address"
            placeholder="Enter vendor address here."
          />
        </div>

        <LoadingButton
          className="!mt-4"
          label="Create Vendor"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
