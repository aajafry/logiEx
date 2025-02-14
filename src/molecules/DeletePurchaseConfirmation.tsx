import { LoadingButton } from "@/atoms";
import { usePurchases } from "@/hooks/usePurchases";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  purchaseMrId: string;
  onRemovePurchase: (mrId: string) => void;
  onClose: () => void;
};

export const DeletePurchaseConfirmation: FC<PropsType> = ({
  purchaseMrId,
  onRemovePurchase,
  onClose,
}) => {
  const { loading, getPurchases, deletePurchase } = usePurchases();

  const handleDelete = async () => {
    const response = await deletePurchase(purchaseMrId);
    if (response) {
      onRemovePurchase(purchaseMrId);
      await getPurchases();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the purchase MR ID{" "}
        <span className="text-destructive font-bold">
          &ldquo;{purchaseMrId}&rdquo;
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
