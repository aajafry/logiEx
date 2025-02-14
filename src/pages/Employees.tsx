import { LoadingButton } from "@/atoms";
import { employeeColumns } from "@/config";
import { useEmployees, useVisibility } from "@/hooks";
import { DeleteEmployeeConfirmation } from "@/molecules";
import {
  CreateEmployeeForm,
  EmployeeDataTable,
  UpdateEmployeeFrom,
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

export const Employees: FC = () => {
  const [employeeIdToEdit, setEmployeeIdToEdit] = useState<string>("");
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    employees,
    getEmployees,
    handleAddEmployee,
    handleUpdateEmployee,
    handleRemoveEmployee,
  } = useEmployees();

  const loadEmployees = useCallback(async () => {
    await getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleEditEmployee = useCallback(
    (updatedEmployeeId: string) => {
      setEmployeeIdToEdit(updatedEmployeeId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteEmployee = useCallback(
    (id: string, name: string) => {
      setEmployeeToDelete({ id, name });
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => employeeColumns(handleEditEmployee, handleDeleteEmployee),
    [handleDeleteEmployee, handleEditEmployee]
  );

  const user = getUser();
  const role = user?.role;

  const canEdit =
    role && ["admin", "fleet-manager", "inventory-manager"].includes(role);
  const canDelete = role === "admin";
  const canCreate = canEdit;

  let filteredEmployees = [];
  if (role === "inventory-manager") {
    filteredEmployees = employees.filter(
      (employee) => employee.role === "inventory-in-charge"
    );
  } else if (role === "fleet-manager") {
    filteredEmployees = employees.filter(
      (employee) => employee.role === "captain"
    );
  } else {
    filteredEmployees = employees;
  }

  return (
    <>
      {/* add employee */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Employee</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new employee to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreateEmployeeForm
            onAddEmployee={handleAddEmployee}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit employee */}
      {canEdit && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update the employee&apos;s details. Ensure accuracy before
                saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateEmployeeFrom
              employeeId={employeeIdToEdit}
              onUpdateEmployee={handleUpdateEmployee}
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
            <DeleteEmployeeConfirmation
              employeeToDelete={employeeToDelete}
              onRemoveEmployee={handleRemoveEmployee}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view employee */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Employees</p>
          {canCreate && (
            <LoadingButton
              label="Create Employee"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <EmployeeDataTable columns={columns} data={filteredEmployees} />
      </div>
    </>
  );
};
