import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const CUSTOMERS_URL = import.meta.env.VITE_CUSTOMERS;

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCustomers = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(CUSTOMERS_URL, token);
      if (response.status === 200) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the customers."
      );
    }
  }, []);

  const getCustomer = useCallback(async (id) => {
    const token = getToken();
    try {
      const response = await getResource(`${CUSTOMERS_URL}/${id}`, token);
      if (response.status === 200) {
        return response.data.customer;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the customer."
      );
    }
  }, []);

  const createCustomer = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(CUSTOMERS_URL, data, token);
      if (response.status === 201) {
        toast.success("Customer created successfully!");
        return response.data.customer;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the customer"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${CUSTOMERS_URL}/${id}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.customer;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
       toast.error(
         error.message || "An error occurred while updating the customer"
       );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${CUSTOMERS_URL}/${id}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the customer."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddCustomer = useCallback((newCustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);
  }, []);

  const handleUpdateCustomer = useCallback((updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  }, []);

  const handleRemoveCustomer = (deletedCustomerId) => {
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
