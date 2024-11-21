import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const CATEGORIES_URL = import.meta.env.VITE_CATEGORIES;

export const useCategogories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(CATEGORIES_URL, token);
      if (response.status === 200) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the categories."
      );
    }
  }, []);

  const getCategory = useCallback(async (name) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${CATEGORIES_URL}/${name.replace(/' '/g, "-")}`,
        token
      );
      if (response.status === 200) {
        return response.data.category;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while fetching the category."
      );
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(CATEGORIES_URL, data, token);
      if (response.status === 201) {
        toast.success("Category created successfully!");
        return response.data.category;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the category"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (name, data) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await updateResource(
        `${CATEGORIES_URL}/${name.replace(/' '/g, "-")}`,
        data,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully");
        return response.data.category;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the category"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (name) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${CATEGORIES_URL}/${name.replace(/' '/g, "-")}`,
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
        error.message || "An error occurred while deleting the category."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddCategory = useCallback((newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const handleUpdateCategory = useCallback((updatedCategory) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.name.toLowerCase() === updatedCategory.name.toLowerCase()
          ? updatedCategory
          : category
      )
    );
  }, []);

  const handleRemoveCategory = (deletedCategoryName) => {
    setCategories((prev) =>
      prev.filter(
        (category) =>
          category.name.toLowerCase() !== deletedCategoryName.toLowerCase()
      )
    );
  };

  return {
    loading,
    categories,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleRemoveCategory,
  };
};
