import { InputField } from "@/molecules";
import { LoadingButton } from "@/atoms";
import { useCustomers } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import { updateCustomerSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ICustomer } from "@/interfaces";

export const UpdateCustomerFrom = ({
  customerId,
  onUpdateCustomer,
  onClose,
}: {
  customerId: string;
  onUpdateCustomer: (customer: ICustomer) => void;
  onClose: () => void;
}) => {
  const { loading, getCustomers, getCustomer, updateCustomer } = useCustomers();

  const updateCustomerFrom = useForm<ICustomer>({
    resolver: zodResolver(updateCustomerSchema),
  });
  const { reset, setValue, handleSubmit, control } = updateCustomerFrom;

  const loadCustomerData = useCallback(async () => {
    const customer = await getCustomer(customerId);
    if (customer) {
      Object.keys(customer).forEach((key) => {
        setValue(
          key as keyof ICustomer,
          customer[key as keyof ICustomer] || ""
        );
      });
    }
  }, [customerId, getCustomer, setValue]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  const handleUpdateCustomerSubmit = async (data: ICustomer) => {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
    };
    const updatedCustomer = await updateCustomer(customerId, formattedData);
    if (updatedCustomer) {
      onUpdateCustomer(updatedCustomer);
      reset();
      await getCustomers();
      onClose();
    }
  };

  return (
    <Form {...updateCustomerFrom}>
      <form
        onSubmit={handleSubmit(handleUpdateCustomerSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1">
          <InputField
            control={control}
            name="name"
            label="Name"
            placeholder="Enter customer name."
          />
          <InputField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter customer email address."
          />

          <InputField
            control={control}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter customer phone number."
          />

          <InputField
            control={control}
            name="address"
            label="Address"
            placeholder="Enter customer address here."
          />
        </div>

        <LoadingButton
          className="!mt-4"
          label="Update Customer"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
