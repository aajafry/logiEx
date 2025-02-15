import { DateField, LoadingButton } from "@/atoms";
import { useSupervisors } from "@/hooks";
import { Form } from "@/shadcn/components/ui/form";
import moment from "moment";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ISupervisor } from "@/interfaces";

export const UpdateSupervisorFrom = ({
  assignmentId,
  onUpdateAssignment,
  onClose,
}: {
  assignmentId: string;
  onUpdateAssignment: (supervisor: ISupervisor) => void;
  onClose: () => void;
}) => {
  const { loading, getSupervisors, getSupervisor, updateSupervisor } =
    useSupervisors();

  const updateSupervisorForm = useForm<ISupervisor>({});
  const { reset, setValue, handleSubmit, control } = updateSupervisorForm;

  const loadSupervisorData = useCallback(async () => {
    const supervisor = await getSupervisor(assignmentId);
    if (supervisor) {
      Object.keys(supervisor).forEach((key) => {
        setValue(
          key as keyof ISupervisor,
          supervisor[key as keyof ISupervisor] || ""
        );
      });
    }
  }, [assignmentId, getSupervisor, setValue]);

  useEffect(() => {
    loadSupervisorData();
  }, [loadSupervisorData]);

  const handleUpdateSupervisorSubmit = async (data: ISupervisor) => {
    const formattedData = {
      ...data,
      termination_date: data.termination_date
        ? moment(data.termination_date).toISOString()
        : null,
      resign_date: data.resign_date
        ? moment(data.resign_date).toISOString()
        : null,
      transfer_date: data.transfer_date
        ? moment(data.transfer_date).toISOString()
        : null,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    const updatedSupervisor = await updateSupervisor(assignmentId, validData);
    if (updatedSupervisor) {
      onUpdateAssignment(updatedSupervisor);
      reset();
      await getSupervisors();
      onClose();
    }
  };

  return (
    <>
      <Form {...updateSupervisorForm}>
        <form
          onSubmit={handleSubmit(handleUpdateSupervisorSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-y-2">
            <DateField
              control={control}
              name="termination_date"
              label="Date of Termination"
            />
            <DateField
              control={control}
              name="resign_date"
              label="Date of Resignation"
            />
            <DateField
              control={control}
              name="transfer_date"
              label="Date of Transfer"
            />
          </div>
          <LoadingButton
            className="!mt-4"
            label="Update Status"
            size="sm"
            disabled={loading}
          />
        </form>
      </Form>
    </>
  );
};
