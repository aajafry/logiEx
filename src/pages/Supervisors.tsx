import { LoadingButton } from "@/atoms";
import { supervisorColumns } from "@/config";
import { useSupervisors, useVisibility } from "@/hooks";
import { DeleteSupervisorConfirmation } from "@/molecules";
import {
  CommonDataTable,
  CreateSupervisorForm,
  UpdateSupervisorFrom,
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

export const Supervisors: FC = () => {
  const [assignmentIdToEdit, setAssignmentIdToEdit] = useState<string>("");
  const [assignmentToDelete, setAssignmentToDelete] = useState<{
    id: string;
    employee: string;
    inventory: string;
  }>({
    id: "",
    employee: "",
    inventory: "",
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
    await getSupervisors();
  }, [getSupervisors]);

  useEffect(() => {
    loadSupervisors();
  }, [loadSupervisors]);

  const handleEditSupervisor = useCallback(
    (updatedAssignmentId: string) => {
      setAssignmentIdToEdit(updatedAssignmentId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteSupervisor = useCallback(
    (id: string, employee: string, inventory: string) => {
      setAssignmentToDelete({ id, employee, inventory });
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => supervisorColumns(handleEditSupervisor, handleDeleteSupervisor),
    [handleDeleteSupervisor, handleEditSupervisor]
  );

  const user = getUser();
  const role = user?.role;

  const canEdit = role && ["admin", "inventory-manager"].includes(role);
  const canDelete = role === "admin";
  const canCreate = role && ["admin", "inventory-manager"].includes(role);

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
      {canEdit && (
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
      {canDelete && (
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
          {canCreate && (
            <LoadingButton
              label="Create Supervisor"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <CommonDataTable
          columns={columns}
          data={supervisors}
          searchColumn="inventory"
        />
      </div>
    </>
  );
};
