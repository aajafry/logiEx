import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const PURCHASES_URL = import.meta.env.VITE_PURCHASES;
const PURCHASE_PRODUCTS_URL = import.meta.env.VITE_PURCHASE_PRODUCTS;

export const usePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPurchases = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(PURCHASES_URL, token);
      if (response.status === 200) {
        setPurchases(response.data.purchases);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the Purchases."
      );
    }
  }, []);

  const getPurchase = useCallback(async (mrId) => {
    const token = getToken();
    try {
      const response = await getResource(`${PURCHASES_URL}/${mrId}`, token);
      if (response.status === 200) {
        return response.data.purchase;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the purchase."
      );
    }
  }, []);

  const createPurchase = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(PURCHASES_URL, data, token);
      if (response.status === 201) {
        toast.success("Purchase created successfully!");
        return response.data.purchase;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the Purchase."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePurchase = useCallback(async (mrId, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${PURCHASES_URL}/${mrId}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.purchase;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the Purchase."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePurchase = useCallback(async (mrId) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${PURCHASES_URL}/${mrId}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the Purchase."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddPurchase = useCallback((newPurchase) => {
    setPurchases((prev) => [...prev, newPurchase]);
  }, []);

  const handleUpdatePurchase = useCallback((updatedPurchase) => {
    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.mr_id === updatedPurchase.mr_id ? updatedPurchase : purchase
      )
    );
  }, []);

  const handleRemovePurchase = (deletedPurchasemrId) => {
    setPurchases((prev) =>
      prev.filter((purchase) => purchase.mr_id !== deletedPurchasemrId)
    );
  };

  const updatePurchaseProduct = useCallback(async (id, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${PURCHASE_PRODUCTS_URL}/${id}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.purchase;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the Purchase Product."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePurchaseProduct = useCallback(async (id) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${PURCHASE_PRODUCTS_URL}/${id}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the Purchase Product."
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
