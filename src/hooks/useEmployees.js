import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const USERS_URL = import.meta.env.VITE_USERS;

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const getEmployees = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(USERS_URL, token);
      if (response.status === 200) {
        setEmployees(response.data.users);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the employees."
      );
    }
  }, []);

  const getEmployee = useCallback(async (id) => {
    const token = getToken();
    try {
      const response = await getResource(`${USERS_URL}/${id}`, token);
      if (response.status === 200) {
        return response.data.user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the employee."
      );
    }
  }, []);

  const createEmployee = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(USERS_URL, data, token);
      if (response.status === 201) {
        toast.success("Employee created successfully!");
        return response.data.user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the employee"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(`${USERS_URL}/${id}`, data, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the employee"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${USERS_URL}/${id}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the employee"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddEmployee = useCallback((newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  }, []);

  const handleUpdateEmployee = useCallback((updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  }, []);

  const handleRemoveEmployee = (deletedEmployeeId) => {
    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== deletedEmployeeId)
    );
  };

  return {
    loading,
    employees,
    setEmployees,
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    handleAddEmployee,
    handleUpdateEmployee,
    handleRemoveEmployee,
  };
};
