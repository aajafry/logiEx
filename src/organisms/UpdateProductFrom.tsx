import { InputField, TextareaField } from "@/molecules";
import { LoadingButton } from "@/atoms";
import { useCategories, useProducts } from "@/hooks";
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
import { ICategory, IProduct } from "@/interfaces";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

export const UpdateProductFrom = ({
  productName,
  onUpdateProduct,
  onClose,
}: {
  productName: string;
  onClose: () => void;
  onUpdateProduct: (product: IProduct) => void;
}) => {
  const { loading, getProducts, getProduct, updateProduct } = useProducts();
  const { categories, getCategories } = useCategories();

  const categoriesOptions: {
    value: string;
    label: string;
  }[] = useMemo(
    () =>
      categories.map((category: ICategory) => ({
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

  const updateProductFrom = useForm<IProduct>({
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
          setValue(key, categoryLabel as string);
        } else {
          setValue(key as keyof IProduct, product[key as keyof IProduct] || "");
        }
      });
    }
  }, [categoriesOptions, getProduct, productName, setValue]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  const handleUpdateProductSubmit = async (data: IProduct) => {
    const formattedData = {
      ...data,
      name: data.name.trim(),
      category: data.category.trim(),
      price: data.price,
      sku: data.sku,
      description: data.description?.trim(),
    };
    const updatedProduct = await updateProduct(productName, formattedData);
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
                          <SelectValue placeholder={`Select a Category...`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-44 w-auto rounded-md border">
                          {categoriesOptions.map((category) => (
                            <SelectItem
                              className="capitalize"
                              key={category?.value}
                              value={category?.label}
                            >
                              {category?.label}
                            </SelectItem>
                          ))}
                        </ScrollArea>
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
