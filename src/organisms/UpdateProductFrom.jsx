/* eslint-disable react/prop-types */
import { InputField, TextareaField } from "@/molecules";
import { LoadingButton } from "@/atoms";
import { useCategogories, useProducts } from "@/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { updateProductSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { Loader2 } from "lucide-react";

export const UpdateProductFrom = ({
  productName,
  onUpdateProduct,
  onClose,
}) => {
  const { loading, getProducts, getProduct, updateProduct } = useProducts();
  const { categories, getCategories } = useCategogories();

  const categoriesOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  const loadCategories = useCallback(
    async () => await getCategories(),
    [getCategories]
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const updateProductFrom = useForm({
    resolver: zodResolver(updateProductSchema),
  });
  const { reset, setValue, handleSubmit, control } = updateProductFrom;

  const loadProductData = useCallback(async () => {
    const product = await getProduct(productName);
    if (product) {
      Object.keys(product).forEach((key) => {
        if (key === "category") {
          const categoryLabel = categoriesOptions.find(
            (category) => category.label === product[key]
          )?.label;
          setValue(key, categoryLabel);
        } else {
          setValue(key, product[key] || "");
        }
      });
    }
  }, [categoriesOptions, getProduct, productName, setValue]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  const handleUpdateProductSubmit = async (data) => {
    const updatedProduct = await updateProduct(productName, data);
    if (updatedProduct) {
      onUpdateProduct(updatedProduct);
      reset();
      await getProducts();
      onClose();
    }
  };

  return (
    <Form {...updateProductFrom}>
      <form
        onSubmit={handleSubmit(handleUpdateProductSubmit)}
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
            render={({ field }) => {
              if (field.value) {
                return (
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
                            key={category?.value}
                            value={category?.label}
                          >
                            {category?.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              } else {
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
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
          label="Update Product"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
