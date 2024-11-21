import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const TRANSFERS_URL = import.meta.env.VITE_TRANSFERS;
const TRANSFER_PRODUCTS_URL = import.meta.env.VITE_TRANSFER_PRODUCTS;

export const useTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTransfers = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(TRANSFERS_URL, token);
      if (response.status === 200) {
        setTransfers(response.data.transfers);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the transfers."
      );
    }
  }, []);

  const getTransfer = useCallback(async (trfId) => {
    const token = getToken();
    try {
      const response = await getResource(`${TRANSFERS_URL}/${trfId}`, token);
      if (response.status === 200) {
        return response.data.transfer;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the transfer."
      );
    }
  }, []);

  const createTransfer = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(TRANSFERS_URL, data, token);
      if (response.status === 201) {
        toast.success("Transfer created successfully!");
        return response.data.transfer;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the Transfer."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransfer = useCallback(async (trfId, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${TRANSFERS_URL}/${trfId}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.transfer;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the Transfer."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransfer = useCallback(async (trfId) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${TRANSFERS_URL}/${trfId}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the Transfer."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddTransfer = useCallback((newTransfer) => {
    setTransfers((prev) => [...prev, newTransfer]);
  }, []);

  const handleUpdateTransfer = useCallback((updatedTransfer) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.trf_id === updatedTransfer.trf_id ? updatedTransfer : transfer
      )
    );
  }, []);

  const handleRemoveTransfer = (deletedTransferTrfId) => {
    setTransfers((prev) =>
      prev.filter((transfer) => transfer.trf_id !== deletedTransferTrfId)
    );
  };

  const updateTransferProduct = useCallback(async (id, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${TRANSFER_PRODUCTS_URL}/${id}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.record;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the Transfer."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransferProduct = useCallback(async (id) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${TRANSFER_PRODUCTS_URL}/${id}`,
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
        error.message ||
          "An error occurred while deleting the Purchase Product."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    transfers,
    getTransfers,
    getTransfer,
    createTransfer,
    updateTransfer,
    deleteTransfer,
    handleAddTransfer,
    handleUpdateTransfer,
    handleRemoveTransfer,
    updateTransferProduct,
    deleteTransferProduct,
  };
};
