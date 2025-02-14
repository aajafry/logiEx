import { IPurchase, IPurchaseProduct } from "@/interfaces";
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

const PURCHASES_URL = import.meta.env.VITE_PURCHASES;
const PURCHASE_PRODUCTS_URL = import.meta.env.VITE_PURCHASE_PRODUCTS;

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getPurchases = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(PURCHASES_URL, token!);
      if (response.status === 200) {
        const { purchases } = response.data as {
          purchases: IPurchase[];
        };
        setPurchases(purchases);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the Purchases.");
    }
  }, []);

  const getPurchase = useCallback(async (mrId: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${PURCHASES_URL}/${mrId}`, token!);
      if (response.status === 200) {
        return response && ((response.data as any).purchase as IPurchase);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the purchase.");
    }
  }, []);

  const createPurchase = useCallback(async (data: Partial<IPurchase>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(PURCHASES_URL, data, token!);
      if (response.status === 201) {
        toast.success("Purchase created successfully!");
        return response && ((response.data as any).purchase as IPurchase);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the Purchase.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePurchase = useCallback(
    async (mrId: string, data: Partial<IPurchase>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${PURCHASES_URL}/${mrId}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).purchase as IPurchase);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the Purchase.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deletePurchase = useCallback(async (mrId: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${PURCHASES_URL}/${mrId}`, token!);
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while deleting the Purchase.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddPurchase = useCallback((newPurchase: IPurchase) => {
    setPurchases((prev) => [...prev, newPurchase]);
  }, []);

  const handleUpdatePurchase = useCallback((updatedPurchase: IPurchase) => {
    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.mr_id === updatedPurchase.mr_id ? updatedPurchase : purchase
      )
    );
  }, []);

  const handleRemovePurchase = (deletedPurchasemrId: string) => {
    setPurchases((prev) =>
      prev.filter((purchase) => purchase.mr_id !== deletedPurchasemrId)
    );
  };

  const updatePurchaseProduct = useCallback(
    async (id: string, data: Partial<IPurchaseProduct>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${PURCHASE_PRODUCTS_URL}/${id}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).purchase as IPurchase);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(
          error,
          "An error occurred while updating the Purchase Product."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deletePurchaseProduct = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${PURCHASE_PRODUCTS_URL}/${id}`,
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
      handleError(
        error,
        "An error occurred while deleting the Purchase Product."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    purchases,
    getPurchases,
    getPurchase,
    createPurchase,
    updatePurchase,
    deletePurchase,
    handleAddPurchase,
    handleUpdatePurchase,
    handleRemovePurchase,
    updatePurchaseProduct,
    deletePurchaseProduct,
  };
};
