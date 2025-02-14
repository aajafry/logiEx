import { LoadingButton } from "@/atoms";
import { useShipments } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  shipmentId: string;
  onRemoveShipment: (shipmentId: string) => void;
  onClose: () => void;
};

export const DeleteShipmentConfirmation: FC<PropsType> = ({
  shipmentId,
  onRemoveShipment,
  onClose,
}) => {
  const { loading, getShipments, deleteShipment } = useShipments();

  const handleDelete = async () => {
    const response = await deleteShipment(shipmentId);
    if (response) {
      onRemoveShipment(shipmentId);
      await getShipments();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the shipment ID{" "}
        <span className="text-destructive font-bold">
          &ldquo;{shipmentId}&rdquo;
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
