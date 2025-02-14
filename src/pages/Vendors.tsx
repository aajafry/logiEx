import { LoadingButton } from "@/atoms";
import { vendorColumns } from "@/config";
import { useVendors, useVisibility } from "@/hooks";
import { DeleteVendorConfirmation } from "@/molecules";
import {
  CommonDataTable,
  CreateVendorForm,
  UpdateVendorFrom,
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

export const Vendors: FC = () => {
  const [vendorNameToEdit, setVendorNameToEdit] = useState<string>("");
  const [vendorNameToDelete, setVendorNameToDelete] = useState<string>("");

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    vendors,
    getVendors,
    handleAddVendor,
    handleUpdateVendor,
    handleRemoveVendor,
  } = useVendors();

  const loadVendors = useCallback(async () => {
    await getVendors();
  }, [getVendors]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleEditVendor = useCallback(
    (updatedVendorName: string) => {
      setVendorNameToEdit(updatedVendorName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteVendor = useCallback(
    (deletedVendorName: string) => {
      setVendorNameToDelete(deletedVendorName);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => vendorColumns(handleEditVendor, handleDeleteVendor),
    [handleDeleteVendor, handleEditVendor]
  );

  const user = getUser();
  const role = user?.role;

  const canEdit = role && ["admin", "procurement-manager"].includes(role);
  const canDelete = role && ["admin", "procurement-manager"].includes(role);
  const canCreate = role && ["admin", "procurement-manager"].includes(role);

  return (
    <>
      {/* add vendor */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Vendor</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Vendor to the system.
            </DialogDescription>
          </DialogHeader>
          <CreateVendorForm
            onAddVendor={handleAddVendor}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit vendor */}
      {canEdit && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit vendor</DialogTitle>
              <DialogDescription>
                Update the vendor&apos;s details. Ensure accuracy before saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateVendorFrom
              vendorName={vendorNameToEdit}
              onUpdateVendor={handleUpdateVendor}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete vendor */}
      {canDelete && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Vendor</DialogTitle>
            </DialogHeader>
            <DeleteVendorConfirmation
              vendorName={vendorNameToDelete}
              onRemoveVendor={handleRemoveVendor}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view vendors */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Vendors</p>
          {canCreate && (
            <LoadingButton
              label="Create Vendor"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <CommonDataTable columns={columns} data={vendors} searchColumn="name" />
      </div>
    </>
  );
};
