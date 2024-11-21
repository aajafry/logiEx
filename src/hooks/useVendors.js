import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const VENDORS_URL = import.meta.env.VITE_VENDORS;

export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const getVendors = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(VENDORS_URL, token);
      if (response.status === 200) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the vendors."
      );
    }
  }, []);

  const getVendor = useCallback(async (name) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${VENDORS_URL}/${name.replace(/' '/g, "-")}`,
        token
      );
      if (response.status === 200) {
        return response.data.vendor;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the vendor."
      );
    }
  }, []);

  const createVendor = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(VENDORS_URL, data, token);
      if (response.status === 201) {
        toast.success("Vendor created successfully!");
        return response.data.vendor;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the vendor"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVendor = useCallback(async (name, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${VENDORS_URL}/${name.replace(/' '/g, "-")}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.vendor;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the vendor"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVendor = useCallback(async (name) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${VENDORS_URL}/${name.replace(/' '/g, "-")}`,
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
        error.message || "An error occurred while deleting the vendor."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddVendor = useCallback((newVendor) => {
    setVendors((prev) => [...prev, newVendor]);
  }, []);

  const handleUpdateVendor = useCallback((updatedVendor) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.name.toLowerCase() === updatedVendor.name.toLowerCase()
          ? updatedVendor
          : vendor
      )
    );
  }, []);

  const handleRemoveVendor = (deletedVendorName) => {
    setVendors((prev) =>
      prev.filter(
        (vendor) =>
          vendor.name.toLowerCase() !== deletedVendorName.toLowerCase()
      )
    );
  };

  return {
    loading,
    vendors,
    getVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    handleAddVendor,
    handleUpdateVendor,
    handleRemoveVendor,
  };
};
