/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useCategogories } from "@/hooks";
import { InputField, TextareaField } from "@/molecules";
import { Form } from "@/shadcn/components/ui/form";
import { createCategorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const CreateCategoryForm = ({ onAddCategory, onClose }) => {
  const { loading, getCategories, createCategory } = useCategogories();

  const createCategoryForm = useForm({
    resolver: zodResolver(createCategorySchema),
  });
  const { reset, handleSubmit, control } = createCategoryForm;

  const handleCreateCategorySubmit = async (data) => {
    const newCategory = await createCategory(data);
    if (newCategory) {
      onAddCategory(newCategory);
      reset();
      await getCategories();
      onClose();
    }
  };

  return (
    <Form {...createCategoryForm}>
      <form
        onSubmit={handleSubmit(handleCreateCategorySubmit)}
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
            placeholder="Type category description here."
          />
        </div>
        <LoadingButton
          className="!mt-4"
          label="Create Category"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
