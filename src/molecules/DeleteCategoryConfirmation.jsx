/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useCategogories } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";

export const DeleteCategoryConfirmation = ({
  categoryName,
  onRemoveCategory,
  onClose,
}) => {
  const { loading, getCategories, deleteCategory } = useCategogories();

  const handleDelete = async () => {
    const response = await deleteCategory(categoryName);
    if (response) {
      onRemoveCategory(categoryName);
      await getCategories();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the category
        <span className="text-destructive font-bold">
          &ldquo;{categoryName}&rdquo;
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
