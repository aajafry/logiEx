/* eslint-disable react/prop-types */
import { InputField } from "@/molecules";
import { useVendors } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import { updateVendorSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/atoms";

export const UpdateVendorFrom = ({ vendorName, onUpdateVendor, onClose }) => {
  const { loading, getVendor, getVendors, updateVendor } = useVendors();

  const updateVendorFrom = useForm({
    resolver: zodResolver(updateVendorSchema),
  });
  const { reset, setValue, handleSubmit, control } = updateVendorFrom;

  const loadVendorData = useCallback(async () => {
    const vendor = await getVendor(vendorName);
    if (vendor) {
      Object.keys(vendor).forEach((key) => {
        setValue(key, vendor[key] || "");
      });
    }
  }, [getVendor, setValue, vendorName]);

  useEffect(() => {
    loadVendorData();
  }, [loadVendorData]);

  const handleUpdateVendorSubmit = async (data) => {
    const updatedVendor = await updateVendor(vendorName, data);
    if (updatedVendor) {
      onUpdateVendor(updatedVendor);
      reset();
      await getVendors();
      onClose();
    }
  };

  return (
    <Form {...updateVendorFrom}>
      <form
        onSubmit={handleSubmit(handleUpdateVendorSubmit)}
        className="space-y-2"
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
          label="Update Vendor"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
