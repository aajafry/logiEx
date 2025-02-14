import { LoadingButton } from "@/atoms";
import { useCustomers } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  customerToDelete: { id: string; name: string };
  onRemoveCustomer: (id: string) => void;
  onClose: () => void;
};

export const DeleteCustomerConfirmation: FC<PropsType> = ({
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
