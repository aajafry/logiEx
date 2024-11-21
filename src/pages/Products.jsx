import { LoadingButton } from "@/atoms";
import { productColumns } from "@/config";
import { useProducts, useVisibility } from "@/hooks";
import {  DataTable, DeleteProductConfirmation, } from "@/molecules";
import { CreateProductForm, UpdateProductFrom } from "@/organisms";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Products = () => {
  const [productNameToEdit, setProductNameToEdit] = useState(null);
  const [productNameToDelete, setProductNameToDelete] = useState(null);

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
  }, [getProducts])

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEditProduct = useCallback(
    (updatedProductName) => {
      setProductNameToEdit(updatedProductName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteProduct = useCallback(
    (deletedProductName) => {
      setProductNameToDelete(deletedProductName);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => productColumns(handleEditProduct, handleDeleteProduct),
    [handleDeleteProduct, handleEditProduct]
  );

  const { role } = getUser()

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
      {["admin", "procurement-manager", "inventory-manager"].includes(role) && (
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
      {["admin", "procurement-manager", "inventory-manager"].includes(role) && (
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
          {["admin", "procurement-manager", "inventory-manager"].includes(
            role
          ) && (
            <LoadingButton
              label="Create Product"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <DataTable columns={columns} data={products} filterColumn="name" />
      </div>
    </>
  );
};
