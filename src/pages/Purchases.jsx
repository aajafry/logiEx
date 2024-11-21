import { LoadingButton } from "@/atoms";
import { purchaseColumns } from "@/config";
import { useVisibility } from "@/hooks";
import { usePurchases } from "@/hooks/usePurchases";
import {
  DataTable,
  DeletePurchaseConfirmation,
} from "@/molecules";
import { CreatePurchaseForm, UpdatePurchaseFrom } from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Purchases = () => {
  const [mrIdToEdit, setMrIdToEdit] = useState(null);
  const [mrIdToDelete, setMrIdToDelete] = useState(null);
  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    purchases,
    getPurchases,
    handleAddPurchase,
    handleUpdatePurchase,
    handleRemovePurchase,
  } = usePurchases();

  const loadPurchases = useCallback(async () => {
    await getPurchases();
  }, [getPurchases]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const handleEditPurchase = useCallback(
    (updatedPurchaseMrId) => {
      setMrIdToEdit(updatedPurchaseMrId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeletePurchase = useCallback(
    (deletedPurchaseMrId) => {
      setMrIdToDelete(deletedPurchaseMrId);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => purchaseColumns(handleEditPurchase, handleDeletePurchase),
    [handleDeletePurchase, handleEditPurchase]
  );

  const { role } = getUser();

  return (
    <>
      {/* add purchase */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Purchase to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreatePurchaseForm
            onAddPurchase={handleAddPurchase}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit purchase */}
      {["admin", "procurement-manager", "inventory-manager"].includes(role) && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Purchase</DialogTitle>
              <DialogDescription>
                Update the purchase details. Ensure accuracy before saving.
              </DialogDescription>
            </DialogHeader>
            <UpdatePurchaseFrom
              purchaseMrId={mrIdToEdit}
              onUpdatePurchase={handleUpdatePurchase}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}
      {/* delete purchase */}

      {["admin"].includes(role) && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Purchase</DialogTitle>
            </DialogHeader>
            <DeletePurchaseConfirmation
              purchaseMrId={mrIdToDelete}
              onRemovePurchase={handleRemovePurchase}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view purchases */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Purchases</p>
          {["admin", "procurement-manager"].includes(role) && (
            <LoadingButton
              label="Create Purchase"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <DataTable columns={columns} data={purchases} filterColumn="vendor" />
      </div>
    </>
  );
};
