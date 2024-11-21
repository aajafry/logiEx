/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useVehicles } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";

export const DeleteVehicleConfirmation = ({
  vehicleToDelete,
  onRemoveVehicle,
  onClose,
}) => {
  const { loading, getVehicles, deleteVehicle } = useVehicles();

  const handleDelete = async () => {
    const response = await deleteVehicle(vehicleToDelete?.vin);
    if (response) {
      onRemoveVehicle(vehicleToDelete?.vin);
      await getVehicles();
      onClose();
    }
    onClose();
  };
  return (
    <>
      <p>
        Are you sure you want to delete the vehicle
        <span className="text-destructive font-bold">
          &ldquo;{vehicleToDelete?.brand}&rdquo;
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
