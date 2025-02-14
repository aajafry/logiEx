import { LoadingButton } from "@/atoms";
import { categoryColumns } from "@/config";
import { useCategories, useVisibility } from "@/hooks";
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
import { FC, useCallback, useEffect, useMemo, useState } from "react";

export const Categories: FC = () => {
  const [categoryNameToEdit, setCategoryNameToEdit] = useState<string>("");
  const [categoryNameToDelete, setCategoryNameToDelete] = useState<string>("");

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    categories,
    getCategories,
    handleAddCategory,
    handleUpdateCategory,
    handleRemoveCategory,
  } = useCategories();

  const loadCategories = useCallback(async () => {
    await getCategories();
  }, [getCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEditCategory = useCallback(
    (updatedCategoryName: string) => {
      setCategoryNameToEdit(updatedCategoryName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteCategory = useCallback(
    (deletedCategoryName: string) => {
      setCategoryNameToDelete(deletedCategoryName);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => categoryColumns(handleEditCategory, handleDeleteCategory),
    [handleDeleteCategory, handleEditCategory]
  );

  const user = getUser();
  const role = user?.role;

  const isAuthorized =
    role &&
    ["admin", "procurement-manager", "inventory-manager"].includes(role);

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
      {isAuthorized && (
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
      {isAuthorized && (
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
          {isAuthorized && (
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
