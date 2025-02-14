import { LoadingButton } from "@/atoms";
import { useCategories, useProducts } from "@/hooks";
import { ICategory, IProduct } from "@/interfaces";
import { InputField, TextareaField } from "@/molecules";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
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

export const CreateProductForm = ({
  onAddProduct,
  onClose,
}: {
  onAddProduct: (product: IProduct) => void;
  onClose: () => void;
}) => {
  const { loading, getProducts, createProduct } = useProducts();
  const { categories, getCategories } = useCategories();

  const categoriesOptions: { value: string; label: string }[] = useMemo(
    () =>
      categories.map((category: ICategory) => ({
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

  const createProductForm = useForm<IProduct>({
    resolver: zodResolver(createProductSchema),
  });
  const { reset, handleSubmit, control } = createProductForm;

  const handleCreateProductSubmit = async (data: IProduct) => {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      category: data.category.trim(),
      price: data.price,
      sku: data.sku,
      description: data.description?.trim(),
    };

    const newProduct = await createProduct(formattedData);
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
                    <ScrollArea className="h-42 w-auto rounded-md border">
                      {categoriesOptions.map((category) => (
                        <SelectItem
                          className="capitalize"
                          key={category.value}
                          value={category.label}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
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
