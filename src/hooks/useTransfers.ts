import { ITransfer, ITransferProduct } from "@/interfaces";
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

const TRANSFERS_URL = import.meta.env.VITE_TRANSFERS;
const TRANSFER_PRODUCTS_URL = import.meta.env.VITE_TRANSFER_PRODUCTS;

export const useTransfers = () => {
  const [transfers, setTransfers] = useState<ITransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getTransfers = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(TRANSFERS_URL, token!);
      if (response.status === 200) {
        const { transfers } = response.data as {
          transfers: ITransfer[];
        };
        setTransfers(transfers);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the transfers.");
    }
  }, []);

  const getTransfer = useCallback(async (trfId: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${TRANSFERS_URL}/${trfId}`, token!);
      if (response.status === 200) {
        return response && ((response.data as any).transfer as ITransfer);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the transfer.");
    }
  }, []);

  const createTransfer = useCallback(async (data: Partial<ITransfer>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(TRANSFERS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Transfer created successfully!");
        return response && ((response.data as any).transfer as ITransfer);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the Transfer.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransfer = useCallback(
    async (trfId: string, data: Partial<ITransfer>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${TRANSFERS_URL}/${trfId}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).transfer as ITransfer);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the transfer.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTransfer = useCallback(async (trfId: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${TRANSFERS_URL}/${trfId}`,
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
      handleError(error, "An error occurred while deleting the transfer.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddTransfer = useCallback((newTransfer: ITransfer) => {
    setTransfers((prev) => [...prev, newTransfer]);
  }, []);

  const handleUpdateTransfer = useCallback((updatedTransfer: ITransfer) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.trf_id === updatedTransfer.trf_id ? updatedTransfer : transfer
      )
    );
  }, []);

  const handleRemoveTransfer = (deletedTransferTrfId: string) => {
    setTransfers((prev) =>
      prev.filter((transfer) => transfer.trf_id !== deletedTransferTrfId)
    );
  };

  const updateTransferProduct = useCallback(
    async (id: string, data: Partial<ITransferProduct>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${TRANSFER_PRODUCTS_URL}/${id}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return (
            response && ((response.data as any).record as ITransferProduct)
          );
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the Transfer.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTransferProduct = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${TRANSFER_PRODUCTS_URL}/${id}`,
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
      handleError(error, "An error occurred while deleting the transfer.");
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
