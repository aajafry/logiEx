/* eslint-disable react/prop-types */
import { InputField, TextareaField } from "@/molecules";
import { useCategogories } from "@/hooks";
import { LoadingButton } from "@/atoms";
import { Form } from "@/shadcn/components/ui/form";
import { updateCategorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export const UpdateCategoryFrom = ({
  categoryName,
  onUpdateCategory,
  onClose,
}) => {
  const { loading, getCategories, getCategory, updateCategory } =
    useCategogories();

  const updateCategoryFrom = useForm({
    resolver: zodResolver(updateCategorySchema),
  });
  const { reset, setValue, handleSubmit, control } = updateCategoryFrom;

  const loadCategoryData = useCallback(async () => {
    const category = await getCategory(categoryName);
    if (category) {
      Object.keys(category).forEach((key) => {
        setValue(key, category[key] || "");
      });
    }
  }, [categoryName, getCategory, setValue]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  const handleUpdateCategorySubmit = async (data) => {
    const updatedCategory = await updateCategory(categoryName, data);
    if (updatedCategory) {
      onUpdateCategory(updatedCategory);
      reset();
      await getCategories();
      onClose();
    }
  };

  return (
    <Form {...updateCategoryFrom}>
      <form
        onSubmit={handleSubmit(handleUpdateCategorySubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1">
          <InputField
            control={control}
            name="name"
            label="Name"
            placeholder="Enter category name."
          />
          <TextareaField
            control={control}
            name="description"
            label="Description"
            placeholder="Enter category description here."
          />
        </div>
        <LoadingButton
          className="!mt-4"
          label="Update Category"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
