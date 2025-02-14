import { ICategory } from "@/interfaces";
import {
  createResource,
  deleteResource,
  getResource,
  getToken,
  updateResource,
  handleError,
} from "@/utilities";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CATEGORIES_URL = import.meta.env.VITE_CATEGORIES;


export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCategories = useCallback(async () => {
    const token = getToken();
    try {
      const response = await getResource(CATEGORIES_URL, token!);
      if (response.status === 200) {
        const { categories } = response.data as {
          categories: ICategory[];
        };
        setCategories(categories);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the categories.");
    }
  }, []);

  const getCategory = useCallback(async (name: string) => {
    const token = getToken();
    try {
      const response = await getResource(
        `${CATEGORIES_URL}/${name.replace(/\s+/g, "-")}`,
        token!
      );
      if (response.status === 200) {
        return (response.data as any).category as ICategory;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      handleError(error, "An error occurred while fetching the category.");
    }
  }, []);

  const createCategory = useCallback(async (data: Partial<ICategory>) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await createResource(CATEGORIES_URL, data, token!);
      if (response.status === 201) {
        toast.success("Category created successfully!");
        return (response.data as any).category as ICategory;
      } else {
        throw new Error(response && (response.data as any).message);
      }
    } catch (error: unknown) {
      toast.error(
        (error as any).message ||
          "An error occurred while creating the category"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (name: string, data: Partial<ICategory>) => {
      const token = getToken();
      setLoading(true);
      try {
        const response = await updateResource(
          `${CATEGORIES_URL}/${name.replace(/\s+/g, "-")}`,
          data,
          token!
        );
        if (response.status === 200) {
          toast.success(
            (response && (response.data as any).message) ||
              "Updated successfully"
          );
          return (response.data as any).category as ICategory;
        } else {
          throw new Error(response && (response.data as any).message);
        }
      } catch (error: unknown) {
        toast.error(
          (error as any).message ||
            "An error occurred while updating the category"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCategory = useCallback(async (name: string) => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await deleteResource(
        `${CATEGORIES_URL}/${name.replace(/\s+/g, "-")}`,
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
      toast.error(
        (error as any).message ||
          "An error occurred while deleting the category."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddCategory = useCallback((newCategory: ICategory) => {
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const handleUpdateCategory = useCallback((updatedCategory: ICategory) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.name.toLowerCase() === updatedCategory.name.toLowerCase()
          ? updatedCategory
          : category
      )
    );
  }, []);

  const handleRemoveCategory = (deletedCategoryName: string) => {
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
