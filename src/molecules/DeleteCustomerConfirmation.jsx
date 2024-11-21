/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useCustomers } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";

export const DeleteCustomerConfirmation = ({
  customerToDelete,
  onRemoveCustomer,
  onClose,
}) => {
  const { loading, getCustomers, deleteCustomer } = useCustomers();

  const handleDelete = async () => {
    const response = await deleteCustomer(customerToDelete?.id);
    if (response) {
      onRemoveCustomer(customerToDelete?.id);
      await getCustomers();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the customer
        <span className="text-destructive font-bold">
          &ldquo;{customerToDelete?.name}&rdquo;
        </span>
        ? This action cannot be undo.
      </p>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>

        <LoadingButton
          label="Confirm"
          disabled={loading}
          variant="destructive"
          onClick={handleDelete}
        />
      </div>
    </>
  );
};
