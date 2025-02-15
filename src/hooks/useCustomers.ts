import { ICustomer } from "@/interfaces";
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

const CUSTOMERS_URL = import.meta.env.VITE_CUSTOMERS;

export const useCustomers = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCustomers = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(CUSTOMERS_URL, token!);
      if (response.status === 200) {
        const { customers } = response.data as {
          customers: ICustomer[];
        };
        setCustomers(customers);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the customers.");
    }
  }, []);

  const getCustomer = useCallback(async (id: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${CUSTOMERS_URL}/${id}`, token!);
      if (response.status === 200) {
        return (response.data as any).customer as ICustomer;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the customer.");
    }
  }, []);

  const createCustomer = useCallback(async (data: Partial<ICustomer>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(CUSTOMERS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Customer created successfully!");
        return (response.data as any).customer as ICustomer;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the customer.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(
    async (id: string, data: Partial<ICustomer>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${CUSTOMERS_URL}/${id}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return (response.data as any).customer as ICustomer;
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error) {
        handleError(error, "An error occurred while updating the customer.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCustomer = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${CUSTOMERS_URL}/${id}`, token!);
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error) {
      handleError(error, "An error occurred while deleting the customer.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddCustomer = useCallback((newCustomer: ICustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);
  }, []);

  const handleUpdateCustomer = useCallback((updatedCustomer: ICustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  }, []);

  const handleRemoveCustomer = (deletedCustomerId: string) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== deletedCustomerId)
    );
  };

  return {
    customers,
    loading,
    setCustomers,
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    handleAddCustomer,
    handleUpdateCustomer,
    handleRemoveCustomer,
  };
};
