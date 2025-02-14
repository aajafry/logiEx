import { LoadingButton } from "@/atoms";
import { useCategories } from "@/hooks";
import { ICategory } from "@/interfaces";
import { InputField, TextareaField } from "@/molecules";
import { Form } from "@/shadcn/components/ui/form";
import { createCategorySchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const CreateCategoryForm = ({
  onAddCategory,
  onClose,
}: {
  onAddCategory: (category: ICategory) => void;
  onClose: () => void;
}) => {
  const { loading, getCategories, createCategory } = useCategories();

  const createCategoryForm = useForm<ICategory>({
    resolver: zodResolver(createCategorySchema),
  });
  const { reset, handleSubmit, control } = createCategoryForm;

  const handleCreateCategorySubmit = async (data: ICategory) => {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim(),
    };
    const newCategory = await createCategory(formattedData);
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
