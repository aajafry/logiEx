import { IProduct } from "@/interfaces";
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

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS;


export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(PRODUCTS_URL, token!);
      if (response.status === 200) {
        const { products } = response.data as {
          products: IProduct[];
        };
        setProducts(products);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the products.");
    }
  }, []);

  const getProduct = useCallback(async (name: string) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${PRODUCTS_URL}/${name.replace(/\s+/g, "-")}`,
        token!
      );
      if (response.status === 200) {
        return (response.data as any).product as IProduct;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error) {
      handleError(error, "An error occurred while fetching the product.");
    }
  }, []);

  const createProduct = useCallback(async (data: Partial<IProduct>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(PRODUCTS_URL, data, token!);
      if (response.status === 201) {
        toast.success("Product created successfully!");
        return response && ((response.data as any).product as IProduct);
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error) {
      handleError(error, "An error occurred while creating the product.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(
    async (name: string, data: Partial<IProduct>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${PRODUCTS_URL}/${name.replace(/\s+/g, "-")}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return response && ((response.data as any).product as IProduct);
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error) {
        handleError(error, "An error occurred while updating the product");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (name: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${PRODUCTS_URL}/${name.replace(/\s+/g, "-")}`,
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
    } catch (error) {
      handleError(error, "An error occurred while deleting the product.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddProduct = useCallback((newProduct: IProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const handleUpdateProduct = useCallback((updatedProduct: IProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.name.toLowerCase() === updatedProduct.name.toLowerCase()
          ? updatedProduct
          : product
      )
    );
  }, []);

  const handleRemoveProduct = (deletedProductName: string) => {
    setProducts((prev) =>
      prev.filter(
        (product) =>
          product.name.toLowerCase() !== deletedProductName.toLowerCase()
      )
    );
  };

  return {
    loading,
    products,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleRemoveProduct,
  };
};
