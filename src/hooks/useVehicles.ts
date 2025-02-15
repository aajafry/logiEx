import { IVehicle } from "@/interfaces";
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

const VEHICLES_URL = import.meta.env.VITE_VEHICLES;

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getVehicles = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(VEHICLES_URL, token!);
      if (response.status === 200) {
        const { vehicles } = response.data as {
          vehicles: IVehicle[];
        };
        setVehicles(vehicles);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the vehicles.");
    }
  }, []);

  const getVehicle = useCallback(async (vin: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${VEHICLES_URL}/${vin}`, token!);
      if (response.status === 200) {
        return response && ((response.data as any).vehicle as IVehicle);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the vehicle.");
    }
  }, []);

  const createVehicle = useCallback(async (data: Partial<IVehicle>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(VEHICLES_URL, data, token!);
      if (response.status === 201) {
        toast.success("Vehicle created successfully!");
        return response && ((response.data as any).vehicle as IVehicle);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the vehicle.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(
    async (vin: string, data: Partial<IVehicle>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${VEHICLES_URL}/${vin}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).vehicle as IVehicle);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the vehicle.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteVehicle = useCallback(async (vin: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${VEHICLES_URL}/${vin}`, token!);
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while deleting the vehicle.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddVehicle = useCallback((newVehicle: IVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  }, []);

  const handleUpdateVehicle = useCallback((updatedVehicle: IVehicle) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.vin.toLowerCase() === updatedVehicle.vin.toLowerCase()
          ? updatedVehicle
          : vehicle
      )
    );
  }, []);

  const handleRemoveVehicle = (deletedVehicleVIN: string) => {
    setVehicles((prev) =>
      prev.filter(
        (vehicle) =>
          vehicle.vin.toLowerCase() !== deletedVehicleVIN.toLowerCase()
      )
    );
  };

  return {
    loading,
    vehicles,
    setVehicles,
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    handleAddVehicle,
    handleUpdateVehicle,
    handleRemoveVehicle,
  };
};
