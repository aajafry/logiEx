import { ISale, ISaleProduct } from "@/interfaces";
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

const SALES_URL = import.meta.env.VITE_SALES;
const SALE_PRODUCTS_URL = import.meta.env.VITE_SALE_PRODUCTS;


export const useSales = () => {
  const [sales, setSales] = useState<ISale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getSales = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(SALES_URL, token!);
      if (response.status === 200) {
        const { sales } = response.data as {
          sales: ISale[];
        };
        setSales(sales);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the Sales.");
    }
  }, []);

  const getSale = useCallback(async (billId: string) => {
    const token = getToken();
    try {
      const response = await getResource(`${SALES_URL}/${billId}`, token!);
      if (response.status === 200) {
        return response && ((response.data as any).sale as ISale);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the sale.");
    }
  }, []);

  const createSale = useCallback(async (data: Partial<ISale>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(SALES_URL, data, token!);
      if (response.status === 201) {
        toast.success("Sale created successfully!");
        return response && ((response.data as any).sale as ISale);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while creating the Sale.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSale = useCallback(async (billId: string, data: any) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${SALES_URL}/${billId}`,
        data,
        token!
      );
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Updated successfully"
        );
        return response && ((response.data as any).sale as ISale);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while updating the Sale.");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSale = useCallback(async (billId: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(`${SALES_URL}/${billId}`, token!);
      if (response.status === 200) {
        toast.success(
          (response && (response.data as any).message) || "Deleted successfully"
        );
        return true;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while deleting the Sale.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddSale = useCallback((newSale: ISale) => {
    setSales((prev) => [...prev, newSale]);
  }, []);

  const handleUpdateSale = useCallback((updatedSale: ISale) => {
    setSales((prev) =>
      prev.map((sale) =>
        sale.bill_id === updatedSale.bill_id ? updatedSale : sale
      )
    );
  }, []);

  const handleRemoveSale = (deletedSalebillId: string) => {
    setSales((prev) =>
      prev.filter((sale) => sale.bill_id !== deletedSalebillId)
    );
  };

  const updateSaleProduct = useCallback(
    async (id: string, data: any) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${SALE_PRODUCTS_URL}/${id}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).sale as ISaleProduct);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        handleError(
          error,
          "An error occurred while updating the Sale Product."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSaleProduct = useCallback(async (id: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${SALE_PRODUCTS_URL}/${id}`,
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
      handleError(error, "An error occurred while deleting the Sale Product.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    sales,
    getSales,
    getSale,
    createSale,
    updateSale,
    deleteSale,
    handleAddSale,
    handleUpdateSale,
    handleRemoveSale,
    updateSaleProduct,
    deleteSaleProduct,
  };
};
