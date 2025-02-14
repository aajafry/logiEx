import { LoadingButton } from "@/atoms";
import { useProducts } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  productName: string;
  onRemoveProduct: (name: string) => void;
  onClose: () => void;
};

export const DeleteProductConfirmation: FC<PropsType> = ({
  productName,
  onRemoveProduct,
  onClose,
}) => {
  const { loading, getProducts, deleteProduct } = useProducts();

  const handleDelete = async () => {
    const response = await deleteProduct(productName);
    if (response) {
      onRemoveProduct(productName);
      await getProducts();
      onClose();
    }
    onClose();
  };
  return (
    <>
      <p>
        Are you sure you want to delete the product
        <span className="text-destructive font-bold">
          &ldquo;{productName}&rdquo;
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
