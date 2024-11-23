import { LoadingButton } from "@/atoms";
import { categoryColumns } from "@/config";
import { useCategogories, useVisibility } from "@/hooks";
import { DeleteCategoryConfirmation } from "@/molecules";
import {
  CommonDataTable,
  CreateCategoryForm,
  UpdateCategoryFrom,
} from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Categories = () => {
  const [categoryNameToEdit, setCategoryNameToEdit] = useState(null);
  const [categoryNameToDelete, setCategoryNameToDelete] = useState(null);

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    categories,
    getCategories,
    handleAddCategory,
    handleUpdateCategory,
    handleRemoveCategory,
  } = useCategogories();

  const loadCategories = useCallback(async () => {
    await getCategories();
  }, [getCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEditCategory = useCallback(
    (updatedCategoryName) => {
      setCategoryNameToEdit(updatedCategoryName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteCategory = useCallback(
    (deletedCategoryName) => {
      setCategoryNameToDelete(deletedCategoryName);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => categoryColumns(handleEditCategory, handleDeleteCategory),
    [handleDeleteCategory, handleEditCategory]
  );

  const { role } = getUser();

  return (
    <>
      {/* add category */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Category to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreateCategoryForm
            onAddCategory={handleAddCategory}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit category */}
      {["admin", "procurement-manager", "inventory-manager"].includes(role) && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category&apos;s details. Ensure accuracy before
                saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateCategoryFrom
              categoryName={categoryNameToEdit}
              onUpdateCategory={handleUpdateCategory}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete category */}
      {["admin", "procurement-manager", "inventory-manager"].includes(role) && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <DeleteCategoryConfirmation
              categoryName={categoryNameToDelete}
              onRemoveCategory={handleRemoveCategory}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view categories */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Categories</p>
          {["admin", "procurement-manager", "inventory-manager"].includes(
            role
          ) && (
            <LoadingButton
              label="Create Category"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <CommonDataTable
          columns={columns}
          data={categories}
          searchColumn="name"
        />
      </div>
    </>
  );
};
