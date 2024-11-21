import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS;

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(PRODUCTS_URL, token);
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the products."
      );
    }
  }, []);

  const getProduct = useCallback(async (name) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${PRODUCTS_URL}/${name.replace(/' '/g, "-")}`,
        token
      );
      if (response.status === 200) {
        return response.data.product;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the product."
      );
    }
  }, []);

  const createProduct = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(PRODUCTS_URL, data, token);
      if (response.status === 201) {
        toast.success("Product created successfully!");
        return response.data.product;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the product"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (name, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${PRODUCTS_URL}/${name.replace(/' '/g, "-")}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.product;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the product"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (name) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${PRODUCTS_URL}/${name.replace(/' '/g, "-")}`,
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
        error.message || "An error occurred while deleting the product."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddProduct = useCallback((newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const handleUpdateProduct = useCallback((updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.name.toLowerCase() === updatedProduct.name.toLowerCase()
          ? updatedProduct
          : product
      )
    );
  }, []);

  const handleRemoveProduct = (deletedProductName) => {
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
