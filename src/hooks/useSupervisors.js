import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const SUPERVISORS_URL = import.meta.env.VITE_INVENTORY_EMPLOYMENTS;

export const useSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSupervisors = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(SUPERVISORS_URL, token);
      if (response.status === 200) {
        setSupervisors(response.data.assignments);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "An error occurred while fetching all inventories with associated employees."
      );
    }
  }, []);

  const getSupervisor = useCallback(async (id) => {
    const token = getToken();
    try {
      const response = await getResource(`${SUPERVISORS_URL}/${id}`, token);
      if (response.status === 200) {
        return response.data.assignment;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "An error occurred while fetching the inventory assignment with associated employee."
      );
    }
  }, []);

  const createSupervisor = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(SUPERVISORS_URL, data, token);
      if (response.status === 201) {
        toast.success("Inventory assignment created successfully!");
        return response.data.assignment;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "An error occurred while creating the inventory assignment "
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSupervisor = useCallback(async (id, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${SUPERVISORS_URL}/${id}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.assignment;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "An error occurred while updating the inventory assignment"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSupervisor = useCallback(async (id) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${SUPERVISORS_URL}/${id}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "An error occurred while deleting the inventory assignment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddSupervisor = useCallback((newSupervisor) => {
    setSupervisors((prev) => [...prev, newSupervisor]);
  }, []);

  const handleUpdateSupervisor = useCallback((updatedSupervisor) => {
    setSupervisors((prev) =>
      prev.map((supervisor) =>
        supervisor.id === updatedSupervisor.id ? updatedSupervisor : supervisor
      )
    );
  }, []);

  const handleRemoveSupervisor = (deletedSupervisorId) => {
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
