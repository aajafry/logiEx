/* eslint-disable react/prop-types */
import { LoadingButton } from "@/atoms";
import { useCategogories, useProducts } from "@/hooks";
import { InputField, TextareaField } from "@/molecules";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { createProductSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const CreateProductForm = ({ onAddProduct, onClose }) => {
  const { loading, getProducts, createProduct } = useProducts();
  const { categories, getCategories } = useCategogories();

  const categoriesOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  const loadCategories = useCallback(async () => {
    await getCategories();
  }, [getCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createProductForm = useForm({
    resolver: zodResolver(createProductSchema),
  });
  const { reset, handleSubmit, control } = createProductForm;

  const handleCreateProductSubmit = async (data) => {
    const newProduct = await createProduct(data);
    if (newProduct) {
      onAddProduct(newProduct);
      reset();
      await getProducts();
      onClose();
    }
  };

  return (
    <Form {...createProductForm}>
      <form
        onSubmit={handleSubmit(handleCreateProductSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1">
          <InputField
            control={control}
            name="name"
            label="Product"
            placeholder="Enter product name."
          />

          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select Category.`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesOptions.map((category) => (
                      <SelectItem
                        className="capitalize"
                        key={category.value}
                        value={category.label}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <InputField
            control={control}
            name="price"
            label="Price"
            placeholder="Enter product price."
          />
          <InputField
            control={control}
            name="sku"
            label="SKU"
            placeholder="Enter product sku."
          />
          <TextareaField
            control={control}
            name="description"
            label="Description"
            placeholder="Enter Product description here."
          />
        </div>

        <LoadingButton
          className="!mt-4"
          label="Create Product"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
