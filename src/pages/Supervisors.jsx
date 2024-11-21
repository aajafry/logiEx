import { LoadingButton } from "@/atoms";
import { supervisorColumns } from "@/config";
import { useSupervisors, useVisibility } from "@/hooks";
import {
  DataTable,
  DeleteSupervisorConfirmation,
} from "@/molecules";
import { CreateSupervisorForm, UpdateSupervisorFrom } from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Supervisors = () => {
  const [assignmentIdToEdit, setAssignmentIdToEdit] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState({
    id: null,
    employee: null,
    inventory: null,
  });

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    supervisors,
    getSupervisors,
    handleAddSupervisor,
    handleUpdateSupervisor,
    handleRemoveSupervisor,
  } = useSupervisors();


  const loadSupervisors = useCallback(async () => {
    await getSupervisors()
  }, [getSupervisors])

  useEffect(() => {
    loadSupervisors();
  }, [loadSupervisors]);

  const handleEditSupervisor = useCallback(
    (updatedAssignmentId) => {
      setAssignmentIdToEdit(updatedAssignmentId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteSupervisor = useCallback(
    (id, employee, inventory) => {
      setAssignmentToDelete({ id, employee, inventory });
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => supervisorColumns(handleEditSupervisor, handleDeleteSupervisor),
    [handleDeleteSupervisor, handleEditSupervisor]
  );

  const { role } = getUser();

  return (
    <>
      {/* add supervisor */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Supervisor</DialogTitle>
            <DialogDescription>
              Enter the required information to associate an inventory and
              assign an employee.
            </DialogDescription>
          </DialogHeader>
          <CreateSupervisorForm
            onAddSupervisor={handleAddSupervisor}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit supervisor */}
      {["admin", "inventory-manager"].includes(role) && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Supervisor</DialogTitle>
              <DialogDescription>
                Update the Supervisor&apos;s details. Ensure accuracy before
                saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateSupervisorFrom
              assignmentId={assignmentIdToEdit}
              onUpdateAssignment={handleUpdateSupervisor}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )} 

      {/* delete employee */}
      {["admin"].includes(role) && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
            </DialogHeader>
            <DeleteSupervisorConfirmation
              assignmentToDelete={assignmentToDelete}
              onRemoveSupervisor={handleRemoveSupervisor}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view supervisors */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">
            Inventory Supervisors
          </p>
          {["admin", "inventory-manager"].includes(role) && (
            <LoadingButton
              label="Create Supervisor"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <DataTable
          columns={columns}
          data={supervisors}
          filterColumn="inventory"
        />
      </div>
    </>
  );
};
