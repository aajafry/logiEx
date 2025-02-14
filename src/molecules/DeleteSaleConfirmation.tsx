import { LoadingButton } from "@/atoms";
import { useSales } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  saleBillId: string;
  onRemoveSale: (BillId: string) => void;
  onClose: () => void;
};

export const DeleteSaleConfirmation: FC<PropsType> = ({
  saleBillId,
  onRemoveSale,
  onClose,
}) => {
  const { loading, getSales, deleteSale } = useSales();

  const handleDelete = async () => {
    const response = await deleteSale(saleBillId);
    if (response) {
      onRemoveSale(saleBillId);
      await getSales();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the sale BILL ID{" "}
        <span className="text-destructive font-bold">
          &ldquo;{saleBillId}&rdquo;
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
