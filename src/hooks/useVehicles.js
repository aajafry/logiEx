import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const VEHICLES_URL = import.meta.env.VITE_VEHICLES;

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getVehicles = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(VEHICLES_URL, token);
      if (response.status === 200) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the vehicles."
      );
    }
  }, []);

  const getVehicle = useCallback(async (vin) => {
    const token = getToken();
    try {
      const response = await getResource(`${VEHICLES_URL}/${vin}`, token);
      if (response.status === 200) {
        return response.data.vehicle;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the vehicle."
      );
    }
  }, []);

  const createVehicle = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(VEHICLES_URL, data, token);
      if (response.status === 201) {
        toast.success("Vehicle created successfully!");
        return response.data.vehicle;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the vehicle"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(async (vin, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${VEHICLES_URL}/${vin}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.vehicle;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the vehicle."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (vin) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${VEHICLES_URL}/${vin}`, token);
      if (response.status === 200) {
        toast.success(response.data.message || "Deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the vehicle."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddVehicle = useCallback((newVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  }, []);

  const handleUpdateVehicle = useCallback((updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.vin.toLowerCase() === updatedVehicle.vin.toLowerCase()
          ? updatedVehicle
          : vehicle
      )
    );
  }, []);

  const handleRemoveVehicle = (deletedVehicleVIN) => {
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
