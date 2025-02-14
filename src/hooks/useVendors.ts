import { IVendor } from "@/interfaces";
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

const VENDORS_URL = import.meta.env.VITE_VENDORS;


export const useVendors = () => {
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getVendors = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(VENDORS_URL, token!);
      if (response.status === 200) {
        const { vendors } = response.data as {
          vendors: IVendor[];
        };
        setVendors(vendors);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the vendors.");
    }
  }, []);

  const getVendor = useCallback(async (name: string) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${VENDORS_URL}/${name.replace(/\s+/g, "-")}`,
        token!
      );
      if (response.status === 200) {
        return response && ((response.data as any).vendor as IVendor);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the vendor.");
    }
  }, []);

  const createVendor = useCallback(async (data: Partial<IVendor>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(VENDORS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Vendor created successfully!");
        return response && ((response.data as any).vendor as IVendor);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the vendor.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVendor = useCallback(
    async (name: string, data: Partial<IVendor>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${VENDORS_URL}/${name.replace(/\s+/g, "-")}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && (response.data as any).vendor;
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(error, "An error occurred while updating the vendor.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteVendor = useCallback(async (name: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${VENDORS_URL}/${name.replace(/\s+/g, "-")}`,
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
      handleError(error, "An error occurred while deleting the vendor.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddVendor = useCallback((newVendor: IVendor) => {
    setVendors((prev) => [...prev, newVendor]);
  }, []);

  const handleUpdateVendor = useCallback((updatedVendor: IVendor) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.name.toLowerCase() === updatedVendor.name.toLowerCase()
          ? updatedVendor
          : vendor
      )
    );
  }, []);

  const handleRemoveVendor = (deletedVendorName: string) => {
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
