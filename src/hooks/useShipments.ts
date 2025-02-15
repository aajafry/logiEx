import { IShipment } from "@/interfaces";
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

const SHIPMENTS_URL = import.meta.env.VITE_SHIPMENTS;
const SHIPMENT_PRODUCTS_URL = import.meta.env.VITE_SHIPMENT_PRODUCTS;

export const useShipments = () => {
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getShipments = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(SHIPMENTS_URL, token!);
      if (response.status === 200) {
        const { shipments } = response.data as {
          shipments: IShipment[];
        };
        setShipments(shipments);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the Shipments.");
    }
  }, []);

  const getShipment = useCallback(async (shipmentId: string) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${SHIPMENTS_URL}/${shipmentId}`,
        token!
      );
      if (response.status === 200) {
        return response && ((response.data as any).shipment as IShipment);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the Shipment.");
    }
  }, []);

  const createShipment = useCallback(async (data: Partial<IShipment>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(SHIPMENTS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Shipment created successfully!");

        return response && ((response.data as any).shipment as IShipment);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the Shipment.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateShipment = useCallback(
    async (shipmentId: string, data: Partial<IShipment>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${SHIPMENTS_URL}/${shipmentId}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).shipment as IShipment);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the Shipment.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteShipment = useCallback(async (shipmentId: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${SHIPMENTS_URL}/${shipmentId}`,
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
      handleError(error, "An error occurred while deleting the Shipment.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddShipment = useCallback((newShipment: IShipment) => {
    setShipments((prev) => [...prev, newShipment]);
  }, []);

  const handleUpdateShipment = useCallback((updatedShipment: IShipment) => {
    setShipments((prev) =>
      prev.map((Shipment) =>
        Shipment.shipment_id === updatedShipment.shipment_id
          ? updatedShipment
          : Shipment
      )
    );
  }, []);

  const handleRemoveShipment = (deletedShipmentshipmentId: string) => {
    setShipments((prev) =>
      prev.filter(
        (Shipment) => Shipment.shipment_id !== deletedShipmentshipmentId
      )
    );
  };

  const deleteSaleProduct = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${SHIPMENT_PRODUCTS_URL}/${id}`,
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
      handleError(error, "An error occurred while deleting the Shipment Item.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    shipments,
    getShipments,
    getShipment,
    createShipment,
    updateShipment,
    deleteShipment,
    handleAddShipment,
    handleUpdateShipment,
    handleRemoveShipment,
    deleteSaleProduct,
  };
};
