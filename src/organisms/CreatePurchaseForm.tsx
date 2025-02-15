import { DateField, LoadingButton } from "@/atoms";
import { useInventories, useProducts, useVendors } from "@/hooks";
import { usePurchases } from "@/hooks/usePurchases";
import { IPurchase } from "@/interfaces";
import { InputField } from "@/molecules";
import { Button } from "@/shadcn/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { createPurchaseSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const CreatePurchaseForm = ({
  onAddPurchase,
  onClose,
}: {
  onAddPurchase: (purchase: IPurchase) => void;
  onClose: () => void;
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { vendors, getVendors } = useVendors();
  const { inventories, getInventories } = useInventories();
  const { products, getProducts } = useProducts();
  const { loading, getPurchases, createPurchase } = usePurchases();

  const vendorOptions: { value: string; label: string }[] = useMemo(
    () =>
      vendors.map((vendor) => ({
        value: vendor.id,
        label: vendor.name,
      })),
    [vendors]
  );

  const inventoryOptions: { value: string; label: string }[] = useMemo(
    () =>
      inventories.map((inventory) => ({
        value: inventory.id,
        label: inventory.name,
      })),
    [inventories]
  );

  const productOptions: { value: string; label: string }[] = useMemo(
    () =>
      products.map((product) => ({
        value: product.id,
        label: product.name,
      })),
    [products]
  );

  const loadVendors = useCallback(async () => await getVendors(), [getVendors]);
  const loadInventories = useCallback(
    async () => await getInventories(),
    [getInventories]
  );
  const loadProducts = useCallback(
    async () => await getProducts(),
    [getProducts]
  );

  useEffect(() => {
    loadVendors();
    loadInventories();
    loadProducts();
  }, [loadInventories, loadProducts, loadVendors]);

  const createPurchaseForm = useForm<IPurchase>({
    resolver: zodResolver(createPurchaseSchema),
  });

  const { reset, watch, handleSubmit, control } = createPurchaseForm;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "products",
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const adjustment = value.adjustment || 0;
      const productsTotal = value.products?.reduce((acc, product) => {
        const quantity = parseFloat(product?.quantity?.toString() || "0");
        const unitPrice = parseFloat(product?.unit_price?.toString() || "0");
        const discount = parseFloat(product?.discount?.toString() || "0");

        const itemTotal = quantity * unitPrice * ((100 - discount) / 100);

        return acc + itemTotal;
      }, 0);

      const adjustmentValue = parseFloat(adjustment.toString()) || 0;
      const totalWithAdjustment = (productsTotal || 0) - adjustmentValue;

      setTotalPrice(totalWithAdjustment >= 0 ? totalWithAdjustment : 0);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleCreatePurchaseSubmit = async (data: IPurchase) => {
    const formattedData = {
      ...data,
      mr_id: data.mr_id.trim(),
      purchase_date: data.purchase_date
        ? moment(data.purchase_date).toISOString()
        : moment().toISOString(),
      vendor: data.vendor.trim(),
      inventory: data.inventory.trim(),
    };

    const newPurchase = await createPurchase(formattedData);
    if (newPurchase) {
      onAddPurchase(newPurchase);
      reset();
      await getPurchases();
      onClose();
    }
  };

  return (
    <Form {...createPurchaseForm}>
      <form
        onSubmit={handleSubmit(handleCreatePurchaseSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            control={control}
            name="mr_id"
            label="MR ID"
            placeholder="Enter MR ID here."
          />
          <DateField
            control={control}
            name="purchase_date"
            label="Date of Purchase"
          />

          <FormField
            control={control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a Vendor...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {vendorOptions.map((vendor) => (
                        <SelectItem
                          className="capitalize"
                          key={vendor.value}
                          value={vendor.label}
                        >
                          {vendor.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select an Inventory...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-44 w-auto rounded-md border">
                      {inventoryOptions.map((inventory) => (
                        <SelectItem
                          className="capitalize"
                          key={inventory.value}
                          value={inventory.label}
                        >
                          {inventory.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4">
              <FormField
                control={control}
                name={`products.${index}.product`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a Product...`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-44 w-auto rounded-md border">
                          {productOptions.map((product) => (
                            <SelectItem
                              className="capitalize"
                              key={product.value}
                              value={product.label}
                            >
                              {product.label}
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
                name={`products.${index}.quantity`}
                label="Quantity"
                placeholder="Enter product quantity here."
              />
              <InputField
                control={control}
                name={`products.${index}.unit_price`}
                label="Unit Price"
                placeholder="Enter product unit price here."
              />

              <InputField
                control={control}
                name={`products.${index}.discount`}
                label="Discount (%)"
                placeholder="Enter product discount (%) here."
              />
              <div className="flex justify-end space-x-2 sm:col-span-2 lg:col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button
          className="bg-emerald-500 hover:bg-emerald-400"
          type="button"
          size="sm"
          onClick={() =>
            append({
              product: "",
              quantity: 0,
              unit_price: 0,
              discount: 0,
            })
          }
        >
          Add Item
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
          <InputField
            control={control}
            name="adjustment"
            label="Adjustment (use Amount)"
            placeholder="Enter adjustment amount here."
          />

          <FormField
            name="total_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={`${totalPrice}`}
                    autoComplete="off"
                    disabled={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton
          className="!mt-4"
          label="Create Purchase"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
