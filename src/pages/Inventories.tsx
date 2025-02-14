import { LoadingButton } from "@/atoms";
import { inventoryColumns } from "@/config";
import { useInventories, useSupervisors, useVisibility } from "@/hooks";
import { DeleteInventoryConfirmation } from "@/molecules";
import {
  CommonDataTable,
  CreateInventoryForm,
  UpdateInventoryFrom,
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
import { useNavigate } from "react-router-dom";

export const Inventories: FC = () => {
  const [inventoryNameToEdit, setInventoryNameToEdit] = useState<string>("");
  const [inventoryNameToDelete, setInventoryNameToDelete] =
    useState<string>("");

  const navigate = useNavigate();

  const { visibility, openVisibility, closeVisibility } = useVisibility();
  const { supervisors, getSupervisors } = useSupervisors();

  const {
    inventories,
    getInventories,
    handleAddInventory,
    handleUpdateInventory,
    handleRemoveInventory,
  } = useInventories();

  const loadInventories = useCallback(async () => {
    await getInventories();
  }, [getInventories]);

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

  const handlePreviewInventory = useCallback(
    (previewInventoryName: string) => {
      navigate(`${previewInventoryName?.replace(/\s+/g, "-").toLowerCase()}`, {
        state: previewInventoryName?.replace(/\s+/g, "-").toLowerCase(),
      });
    },
    [navigate]
  );

  const handleEditInventory = useCallback(
    (updatedInventoryName: string) => {
      setInventoryNameToEdit(updatedInventoryName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteInventory = useCallback(
    (deletedInventoryName: string) => {
      setInventoryNameToDelete(deletedInventoryName);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () =>
      inventoryColumns(
        handlePreviewInventory,
        handleEditInventory,
        handleDeleteInventory
      ),
    [handlePreviewInventory, handleEditInventory, handleDeleteInventory]
  );

  const user = getUser();
  const role = user?.role;
  const email = user?.email;

  const canEdit = role && ["admin", "inventory-manager"].includes(role);
  const canDelete = role === "admin";
  const canCreate = canEdit;

  const loadSupervisor = useCallback(async () => {
    if (role === "inventory-in-charge") {
      await getSupervisors();
    }
  }, [getSupervisors, role]);

  useEffect(() => {
    loadSupervisor();
  }, [loadSupervisor]);

  useEffect(() => {
    if (role === "inventory-in-charge") {
      supervisors.forEach((supervisor) => {
        if (
          supervisor?.employee?.email === email &&
          supervisor?.employee_status === true
        ) {
          navigate(
            `${supervisor?.inventory?.replace(/\s+/g, "-").toLowerCase()}`,
            {
              state: supervisor?.inventory?.replace(/\s+/g, "-").toLowerCase(),
            }
          );
        }
      });
    }
  }, [role, supervisors, email, navigate]);

  return (
    <>
      {/* add inventory */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Inventory</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Inventory to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreateInventoryForm
            onAddInventory={handleAddInventory}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit inventory */}
      {canEdit && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Inventory</DialogTitle>
              <DialogDescription>
                Update the inventory details. Ensure accuracy before saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateInventoryFrom
              inventoryName={inventoryNameToEdit}
              onUpdateInventory={handleUpdateInventory}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete inventory */}
      {canDelete && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Inventory</DialogTitle>
            </DialogHeader>
            <DeleteInventoryConfirmation
              inventoryName={inventoryNameToDelete}
              onRemoveInventory={handleRemoveInventory}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view inventories */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Inventories</p>
          {canCreate && (
            <LoadingButton
              label="Create Inventory"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <CommonDataTable
          columns={columns}
          data={inventories}
          searchColumn="name"
        />
      </div>
    </>
  );
};
