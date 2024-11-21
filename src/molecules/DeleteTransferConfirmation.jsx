/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useTransfers } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";

export const DeleteTransferConfirmation = ({
  transferTrfId,
  onRemoveTransfer,
  onClose,
}) => {
  const { loading, getTransfers, deleteTransfer } = useTransfers();

  const handleDelete = async () => {
    const response = await deleteTransfer(transferTrfId);
    if (response) {
      onRemoveTransfer(transferTrfId);
      await getTransfers();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the transfer TRF ID{" "}
        <span className="text-destructive font-bold">
          &ldquo;{transferTrfId}&rdquo;
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
