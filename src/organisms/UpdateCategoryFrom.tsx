import { LoadingButton } from "@/atoms";
import { useCategories } from "@/hooks";
import { ICategory } from "@/interfaces";
import { InputField, TextareaField } from "@/molecules";
import { Form } from "@/shadcn/components/ui/form";
import { updateCategorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export const UpdateCategoryFrom = ({
  categoryName,
  onUpdateCategory,
  onClose,
}: {
  categoryName: string;
  onUpdateCategory: (category: ICategory) => void;
  onClose: () => void;
}) => {
  const { loading, getCategories, getCategory, updateCategory } =
    useCategories();

  const updateCategoryFrom = useForm<ICategory>({
    resolver: zodResolver(updateCategorySchema),
  });
  const { reset, setValue, handleSubmit, control } = updateCategoryFrom;

  const loadCategoryData = useCallback(async () => {
    const category = await getCategory(categoryName);
    if (category) {
      Object.keys(category).forEach((key) => {
        setValue(
          key as keyof ICategory,
          category[key as keyof ICategory] || ""
        );
      });
    }
  }, [categoryName, getCategory, setValue]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  const handleUpdateCategorySubmit = async (data: ICategory) => {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim(),
    };

    const updatedCategory = await updateCategory(categoryName, formattedData);
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
