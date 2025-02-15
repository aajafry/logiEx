import { IEmployee } from "@/interfaces";
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

const USERS_URL = import.meta.env.VITE_USERS;

export const useEmployees = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getEmployees = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(USERS_URL, token!);
      if (response.status === 200) {
        const { users } = response.data as {
          users: IEmployee[];
        };
        setEmployees(users);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the employees.");
    }
  }, []);

  const getEmployee = useCallback(async (id: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${USERS_URL}/${id}`, token!);
      if (response.status === 200) {
        return (response.data as any).user as IEmployee;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the employee.");
    }
  }, []);

  const createEmployee = useCallback(async (data: Partial<IEmployee>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(USERS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Employee created successfully!");
        return (response.data as any).user as IEmployee;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error) {
      handleError(error, "An error occurred while creating the employee.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(
    async (id: string, data: Partial<IEmployee>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${USERS_URL}/${id}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return (response.data as any).user as IEmployee;
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error) {
        handleError(error, "An error occurred while updating the employee.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteEmployee = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${USERS_URL}/${id}`, token!);
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while deleting the employee.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddEmployee = useCallback((newEmployee: IEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  }, []);

  const handleUpdateEmployee = useCallback((updatedEmployee: IEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  }, []);

  const handleRemoveEmployee = (deletedEmployeeId: string) => {
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
