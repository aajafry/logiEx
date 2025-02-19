import { LoadingButton } from "@/atoms";
import { transferColumns } from "@/config";
import { useSupervisors, useTransfers, useVisibility } from "@/hooks";
import { ITransfer } from "@/interfaces";
import { DeleteTransferConfirmation } from "@/molecules";
import {
  CreateTransferForm,
  TransferDataTable,
  UpdateTransferFrom,
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

export const Transfers: FC = () => {
  const [trfIdToEdit, setTrfIdToEdit] = useState<string>("");
  const [trfIdToDelete, setTrfIdToDelete] = useState<string>("");
  const [filterredTransfers, setFilterredTransfers] = useState<
    ITransfer[] | null
  >([] as ITransfer[]);
  const { visibility, openVisibility, closeVisibility } = useVisibility();
  const { supervisors, getSupervisors } = useSupervisors();

  const {
    transfers,
    getTransfers,
    handleAddTransfer,
    handleUpdateTransfer,
    handleRemoveTransfer,
  } = useTransfers();

  const loadSupervisors = useCallback(async () => {
    await getSupervisors();
  }, [getSupervisors]);

  const loadTransfers = useCallback(async () => {
    await getTransfers();
  }, [getTransfers]);

  useEffect(() => {
    loadSupervisors();
    loadTransfers();
  }, [loadSupervisors, loadTransfers]);

  const handleEditTransfer = useCallback(
    (updatedTransferTrfId: string) => {
      setTrfIdToEdit(updatedTransferTrfId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteTransfer = useCallback(
    (deletedTransferTrfId: string) => {
      setTrfIdToDelete(deletedTransferTrfId);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => transferColumns(handleEditTransfer, handleDeleteTransfer),
    [handleDeleteTransfer, handleEditTransfer]
  );

  const user = getUser();
  const role = user?.role;
  const email = user?.email;

  const canEdit =
    role &&
    ["admin", "inventory-manager", "inventory-in-charge"].includes(role);
  const canDelete = role && ["admin", "inventory-manager"].includes(role);
  const canCreate =
    role &&
    ["admin", "inventory-manager", "inventory-in-charge"].includes(role);

  useEffect(() => {
    if (role === "inventory-in-charge") {
      supervisors.forEach((supervisor) => {
        if (
          supervisor?.employee?.email === email &&
          supervisor?.employee_status === true
        ) {
          const filterredTransfer = transfers.filter(
            (transfer) =>
              transfer?.source_inventory === supervisor?.inventory ||
              transfer?.destination_inventory === supervisor?.inventory
          );
          setFilterredTransfers(filterredTransfer);
        }
      });
    } else {
      setFilterredTransfers(transfers);
    }
  }, [role, supervisors, email, transfers]);

  return (
    <>
      {/* add transfer */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Transfer</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Transfer to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreateTransferForm
            onAddTransfer={handleAddTransfer}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit transfer */}
      {canEdit && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Transfer</DialogTitle>
              <DialogDescription>
                Update the Transfer details. Ensure accuracy before saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateTransferFrom
              transferTrfId={trfIdToEdit}
              onUpdateTransfer={handleUpdateTransfer}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete transfer */}
      {canDelete && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Transfer</DialogTitle>
            </DialogHeader>
            <DeleteTransferConfirmation
              transferTrfId={trfIdToDelete}
              onRemoveTransfer={handleRemoveTransfer}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view transfers */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Transfers</p>
          {canCreate && (
            <LoadingButton
              label="Create Transfer"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <TransferDataTable columns={columns} data={filterredTransfers || []} />
      </div>
    </>
  );
};
