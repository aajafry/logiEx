import { LoadingButton } from "@/atoms";
import { productColumns } from "@/config";
import { useProducts, useVisibility } from "@/hooks";
import { DeleteProductConfirmation } from "@/molecules";
import {
  CreateProductForm,
  ProductDataTable,
  UpdateProductFrom,
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

export const Products: FC = () => {
  const [productNameToEdit, setProductNameToEdit] = useState<string>("");
  const [productNameToDelete, setProductNameToDelete] = useState<string>("");

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    products,
    getProducts,
    handleAddProduct,
    handleUpdateProduct,
    handleRemoveProduct,
  } = useProducts();

  const loadProducts = useCallback(async () => {
    await getProducts();
  }, [getProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEditProduct = useCallback(
    (updatedProductName: string) => {
      setProductNameToEdit(updatedProductName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteProduct = useCallback(
    (deletedProductName: string) => {
      setProductNameToDelete(deletedProductName);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => productColumns(handleEditProduct, handleDeleteProduct),
    [handleDeleteProduct, handleEditProduct]
  );

  const user = getUser();
  const role = user?.role;

  const isAuthorized =
    role &&
    ["admin", "procurement-manager", "inventory-manager"].includes(role);

  return (
    <>
      {/* add product */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Product to the system.
            </DialogDescription>
          </DialogHeader>
          <CreateProductForm
            onAddProduct={handleAddProduct}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit product */}
      {isAuthorized && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product&apos;s details. Ensure accuracy before
                saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateProductFrom
              productName={productNameToEdit}
              onUpdateProduct={handleUpdateProduct}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete product */}
      {isAuthorized && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <DeleteProductConfirmation
              productName={productNameToDelete}
              onRemoveProduct={handleRemoveProduct}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view products */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Products</p>
          {isAuthorized && (
            <LoadingButton
              label="Create Product"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <ProductDataTable columns={columns} data={products} />
      </div>
    </>
  );
};
