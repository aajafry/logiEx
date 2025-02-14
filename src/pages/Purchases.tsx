import { LoadingButton } from "@/atoms";
import { purchaseColumns } from "@/config";
import { useVisibility } from "@/hooks";
import { usePurchases } from "@/hooks/usePurchases";
import { DeletePurchaseConfirmation } from "@/molecules";
import {
  CreatePurchaseForm,
  PurchaseDataTable,
  UpdatePurchaseFrom,
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

export const Purchases: FC = () => {
  const [mrIdToEdit, setMrIdToEdit] = useState<string>("");
  const [mrIdToDelete, setMrIdToDelete] = useState<string>("");
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
    (updatedPurchaseMrId: string) => {
      setMrIdToEdit(updatedPurchaseMrId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeletePurchase = useCallback(
    (deletedPurchaseMrId: string) => {
      setMrIdToDelete(deletedPurchaseMrId);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => purchaseColumns(handleEditPurchase, handleDeletePurchase),
    [handleDeletePurchase, handleEditPurchase]
  );

  const user = getUser();
  const role = user?.role;

  const canEdit =
    role &&
    ["admin", "procurement-manager", "inventory-manager"].includes(role);
  const canDelete = role === "admin";
  const canCreate = role && ["admin", "procurement-manager"].includes(role);

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
      {canEdit && (
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

      {canDelete && (
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
          {canCreate && (
            <LoadingButton
              label="Create Purchase"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <PurchaseDataTable columns={columns} data={purchases} />
      </div>
    </>
  );
};
