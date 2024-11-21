import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const INVENTORIES_URL = import.meta.env.VITE_INVENTORIES;

export const useInventories = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInventories = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(INVENTORIES_URL, token);
      if (response.status === 200) {
        setInventories(response.data.inventories);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the inventories."
      );
    }
  }, []);

  const getInventory = useCallback(async (name) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${INVENTORIES_URL}/${name.replace(/' '/g, "-")}`,
        token
      );
      if (response.status === 200) {
        return response.data.inventory;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the inventory."
      );
    }
  }, []);

  const createInventory = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(INVENTORIES_URL, data, token);
      if (response.status === 201) {
        toast.success("Inventory created successfully!");
        return response.data.inventory;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the inventory"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInventory = useCallback(async (name, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${INVENTORIES_URL}/${name.replace(/' '/g, "-")}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.inventory;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the inventory"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInventory = useCallback(async (name) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${INVENTORIES_URL}/${name.replace(/' '/g, "-")}`,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the inventory."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddInventory = useCallback((newInventory) => {
    setInventories((prev) => [...prev, newInventory]);
  }, []);

  const handleUpdateInventory = useCallback((updatedInventory) => {
    setInventories((prev) =>
      prev.map((inventory) =>
        inventory.name.toLowerCase() === updatedInventory.name.toLowerCase()
          ? updatedInventory
          : inventory
      )
    );
  }, []);

  const handleRemoveInventory = (deletedInventoryName) => {
    setInventories((prev) =>
      prev.filter(
        (inventory) =>
          inventory.name.toLowerCase() !== deletedInventoryName.toLowerCase()
      )
    );
  };

  return {
    loading,
    inventories,
    getInventories,
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory,
    handleAddInventory,
    handleUpdateInventory,
    handleRemoveInventory,
  };
};
