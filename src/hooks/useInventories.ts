import { IInventory } from "@/interfaces";
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

const INVENTORIES_URL = import.meta.env.VITE_INVENTORIES;

export const useInventories = () => {
  const [inventories, setInventories] = useState<IInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getInventories = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(INVENTORIES_URL, token!);
      if (response.status === 200) {
        const { inventories } = response.data as {
          inventories: IInventory[];
        };
        setInventories(inventories);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the inventories.");
    }
  }, []);

  const getInventory = useCallback(async (name: string) => {
    const token = getToken();

    try {
      const response = await getResource(
        `${INVENTORIES_URL}/${name.replace(/\s+/g, "-")}`,
        token!
      );
      if (response.status === 200) {
        return (response.data as any).inventory as IInventory;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the inventory.");
    }
  }, []);

  const createInventory = useCallback(async (data: Partial<IInventory>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(INVENTORIES_URL, data, token!);
      if (response.status === 201) {
        toast.success("Inventory created successfully!");
        return (response.data as any).inventory as IInventory;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInventory = useCallback(
    async (name: string, data: Partial<IInventory>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${INVENTORIES_URL}/${name.replace(/\s+/g, "-")}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).inventory as IInventory);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the inventory");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteInventory = useCallback(async (name: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${INVENTORIES_URL}/${name.replace(/\s+/g, "-")}`,
        token!
      );
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while deleting the inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddInventory = useCallback((newInventory: IInventory) => {
    setInventories((prev) => [...prev, newInventory]);
  }, []);

  const handleUpdateInventory = useCallback((updatedInventory: IInventory) => {
    setInventories((prev) =>
      prev.map((inventory) =>
        inventory.name.toLowerCase() === updatedInventory.name.toLowerCase()
          ? updatedInventory
          : inventory
      )
    );
  }, []);

  const handleRemoveInventory = (deletedInventoryName: string) => {
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
