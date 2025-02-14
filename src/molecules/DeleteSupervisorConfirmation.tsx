import { LoadingButton } from "@/atoms";
import { useSupervisors } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { FC } from "react";

type PropsType = {
  assignmentToDelete: {
    id: string;
    employee: string;
    inventory: string;
  };
  onRemoveSupervisor: (id: string) => void;
  onClose: () => void;
};

export const DeleteSupervisorConfirmation: FC<PropsType> = ({
  assignmentToDelete,
  onRemoveSupervisor,
  onClose,
}) => {
  const { loading, getSupervisors, deleteSupervisor } = useSupervisors();

  const handleDelete = async () => {
    const response = await deleteSupervisor(assignmentToDelete?.id);
    if (response) {
      onRemoveSupervisor(assignmentToDelete?.id);
      await getSupervisors();
      onClose();
    }
    onClose();
  };
  return (
    <>
      <p>
        Are you sure you want to delete the assignment where the employee{" "}
        <span className="text-destructive font-bold">
          &ldquo;{assignmentToDelete?.employee}&rdquo;
        </span>{" "}
        is associated with the inventory{" "}
        <span className="text-destructive font-bold">
          &ldquo;{assignmentToDelete?.inventory}&rdquo;
        </span>
        ? This action cannot be undone.
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
