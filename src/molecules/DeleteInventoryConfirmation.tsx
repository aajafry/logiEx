import { LoadingButton } from "@/atoms";
import { useInventories } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  inventoryName: string;
  onRemoveInventory: (name: string) => void;
  onClose: () => void;
};

export const DeleteInventoryConfirmation: FC<PropsType> = ({
  inventoryName,
  onRemoveInventory,
  onClose,
}) => {
  const { loading, getInventories, deleteInventory } = useInventories();

  const handleDelete = async () => {
    const response = await deleteInventory(inventoryName);
    if (response) {
      onRemoveInventory(inventoryName);
      await getInventories();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the inventory
        <span className="text-destructive font-bold">
          &ldquo;{inventoryName}&rdquo;
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
