import { LoadingButton } from "@/atoms";
import { useEmployees } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  employeeToDelete: { id: string; name: string };
  onRemoveEmployee: (id: string) => void;
  onClose: () => void;
};

export const DeleteEmployeeConfirmation: FC<PropsType> = ({
  employeeToDelete,
  onRemoveEmployee,
  onClose,
}) => {
  const { loading, deleteEmployee, getEmployees } = useEmployees();

  const handleDelete = async () => {
    const response = await deleteEmployee(employeeToDelete?.id);
    if (response) {
      onRemoveEmployee(employeeToDelete?.id);
      await getEmployees();
      onClose();
    }
    onClose();
  };

  return (
    <>
      <p>
        Are you sure you want to delete the employee
        <span className="text-destructive font-bold">
          &ldquo;{employeeToDelete?.name}&rdquo;
        </span>
        ? This action cannot be undo.
      </p>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>

        <LoadingButton
          label="Confirm"
          disabled={loading}
          variant="destructive"
          onClick={handleDelete}
        />
      </div>
    </>
  );
};
