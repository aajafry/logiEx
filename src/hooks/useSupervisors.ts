import { ISupervisor } from "@/interfaces";
import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  handleError,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const SUPERVISORS_URL = import.meta.env.VITE_INVENTORY_EMPLOYMENTS;

export const useSupervisors = () => {
  const [supervisors, setSupervisors] = useState<ISupervisor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getSupervisors = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(SUPERVISORS_URL, token!);
      if (response.status === 200) {
        const { assignments } = response.data as {
          assignments: ISupervisor[];
        };
        setSupervisors(assignments);
      }
    } catch (error: unknown) {
      handleError(
        error,
        "An error occurred while fetching all inventories with associated employees."
      );
    }
  }, []);

  const getSupervisor = useCallback(async (id: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${SUPERVISORS_URL}/${id}`, token!);
      if (response.status === 200) {
        return response && ((response.data as any).assignment as ISupervisor);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(
        error,
        "An error occurred while fetching the inventory assignment with associated employee."
      );
    }
  }, []);

  const createSupervisor = useCallback(async (data: Partial<ISupervisor>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(SUPERVISORS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Inventory assignment created successfully!");
        return response && ((response.data as any).assignment as ISupervisor);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(
        error,
        "An error occurred while creating the inventory assignment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSupervisor = useCallback(
    async (id: string, data: Partial<ISupervisor>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${SUPERVISORS_URL}/${id}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).assignment as ISupervisor);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(
          error,
          "An error occurred while updating the inventory assignment."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSupervisor = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${SUPERVISORS_URL}/${id}`, token!);
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(
        error,
        "An error occurred while deleting the inventory assignment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddSupervisor = useCallback((newSupervisor: ISupervisor) => {
    setSupervisors((prev) => [...prev, newSupervisor]);
  }, []);

  const handleUpdateSupervisor = useCallback(
    (updatedSupervisor: ISupervisor) => {
      setSupervisors((prev) =>
        prev.map((supervisor) =>
          supervisor.id === updatedSupervisor.id
            ? updatedSupervisor
            : supervisor
        )
      );
    },
    []
  );

  const handleRemoveSupervisor = (deletedSupervisorId: string) => {
    setSupervisors((prev) =>
      prev.filter((supervisor) => supervisor.id !== deletedSupervisorId)
    );
  };

  return {
    loading,
    supervisors,
    getSupervisors,
    getSupervisor,
    createSupervisor,
    updateSupervisor,
    deleteSupervisor,
    handleAddSupervisor,
    handleUpdateSupervisor,
    handleRemoveSupervisor,
  };
};
