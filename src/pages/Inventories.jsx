import { LoadingButton } from "@/atoms";
import { inventoryColumns } from "@/config";
import { useInventories, useSupervisors, useVisibility } from "@/hooks";
import {
  DataTable,
  DeleteInventoryConfirmation,
} from "@/molecules";
import { CreateInventoryForm, UpdateInventoryFrom } from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Inventories = () => {
  const [inventoryNameToEdit, setInventoryNameToEdit] = useState(null);
  const [inventoryNameToDelete, setInventoryNameToDelete] = useState(null);

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
    (previewInventoryName) => {
      navigate(`${previewInventoryName?.replace(/\s+/g, "-").toLowerCase()}`, {
        state: previewInventoryName?.replace(/\s+/g, "-").toLowerCase(),
      });
    },
    [navigate]
  );

  const handleEditInventory = useCallback(
    (updatedInventoryName) => {
      setInventoryNameToEdit(updatedInventoryName);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteInventory = useCallback(
    (deletedInventoryName) => {
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

  const { role, email } = getUser();

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
      {["admin", "inventory-manager"].includes(role) && (
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
      {["admin"].includes(role) && (
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
          {["admin", "inventory-manager"].includes(role) && (
            <LoadingButton
              label="Create Inventory"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <DataTable columns={columns} data={inventories} filterColumn="name" />
      </div>
    </>
  );
};
