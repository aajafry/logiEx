import { LoadingButton } from "@/atoms";
import { InputField } from "@/molecules";
import { useCustomers } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import { createCustomerSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ICustomer } from "@/interfaces";

export const CreateCustomerForm = ({
  onAddCustomer,
  onClose,
}: {
  onAddCustomer: (customer: ICustomer) => void;
  onClose: () => void;
}) => {
  const { loading, getCustomers, createCustomer } = useCustomers();

  const createCustomerForm = useForm<ICustomer>({
    resolver: zodResolver(createCustomerSchema),
  });
  const { reset, handleSubmit, control } = createCustomerForm;

  const handleCreateCustomerSubmit = async (data: ICustomer) => {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
    };
    const newCustomer = await createCustomer(formattedData);
    if (newCustomer) {
      onAddCustomer(newCustomer);
      reset();
      await getCustomers();
      onClose();
    }
  };

  return (
    <Form {...createCustomerForm}>
      <form
        onSubmit={handleSubmit(handleCreateCustomerSubmit)}
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
          label="Create Customer"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
