/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useVendors } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";

export const DeleteVendorConfirmation = ({
  vendorName,
  onRemoveVendor,
  onClose,
}) => {
  const { loading, getVendors, deleteVendor } = useVendors();
  
  const handleDelete = async () => {
    const response = await deleteVendor(vendorName);
    if (response) {
      onRemoveVendor(vendorName);
      await getVendors();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the vendor
        <span className="text-destructive font-bold">
          &ldquo;{vendorName}&rdquo;
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
