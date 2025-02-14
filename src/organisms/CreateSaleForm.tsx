import { DateField } from "@/atoms";
import { InputField } from "@/molecules";
import { useCustomers, useInventories, useSales } from "@/hooks";
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
import { createSaleSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { salesStatusEnum as salesOptions } from "@/utilities";
import { LoadingButton } from "@/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { ISale } from "@/interfaces";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

export const CreateSaleForm = ({
  onAddSale,
  onClose,
}: {
  onAddSale: (sale: ISale) => void;
  onClose: () => void;
}) => {
  const [productOptions, setProductOptions] = useState<
    { value: string | number; label: string }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { inventories, getInventory, getInventories } = useInventories();
  const { customers, getCustomers } = useCustomers();
  const { loading, getSales, createSale } = useSales();

  const inventoryOptions: { value: string; label: string }[] = useMemo(
    () =>
      inventories.map((inventory) => ({
        value: inventory.id,
        label: inventory.name,
      })),
    [inventories]
  );

  const customerOptions: { value: string; label: string }[] = useMemo(
    () =>
      customers.map((customer) => ({
        value: customer.id,
        label: `${customer.name} (${customer.email})`,
      })),
    [customers]
  );

  const loadInventories = useCallback(
    async () => await getInventories(),
    [getInventories]
  );
  const loadCustomers = useCallback(
    async () => await getCustomers(),
    [getCustomers]
  );

  useEffect(() => {
    loadInventories();
    loadCustomers();
  }, [loadCustomers, loadInventories]);

  const createSaleForm = useForm<ISale>({
    resolver: zodResolver(createSaleSchema),
  });

  const { reset, watch, handleSubmit, control } = createSaleForm;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "products",
  });

  const inventoryProducts = useCallback(
    async (name: string) => {
      if (!name) return;
      const data = await getInventory(name);
      const storage = data?.inventories;
      const productOptions = storage?.map((product, index) => ({
        value: product?.id || index,
        label: product?.product,
      }));
      setProductOptions(productOptions || []);
    },
    [getInventory]
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const inventoryName = value.inventory;
      if (inventoryName) {
        inventoryProducts(inventoryName);
      }
    });
    return () => subscription.unsubscribe();
  }, [getInventory, inventoryProducts, watch]);

  useEffect(() => {
    const subscription = watch((value) => {
      const adjustment = value.adjustment || 0;
      const productsTotal = value.products?.reduce((acc, product) => {
        const quantity = parseInt(product?.quantity?.toString() || "0");
        const unitPrice = parseFloat(product?.unit_price?.toString() || "0");
        const discount = parseFloat(product?.discount?.toString() || "0");

        const itemTotal = quantity * unitPrice * ((100 - discount) / 100);

        return acc + itemTotal;
      }, 0);

      const adjustmentValue = parseFloat(adjustment.toString()) || 0;
      const totalWithAdjustment = (productsTotal || 0) - adjustmentValue;

      setTotalPrice(
        totalWithAdjustment >= 0
          ? parseFloat(totalWithAdjustment.toFixed(3))
          : 0
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleCreateSaleSubmit = async (data: ISale) => {
    const formattedData = {
      ...data,
      bill_id: data.bill_id.trim(),
      inventory: data.inventory.trim(),
      customer_id: data.customer_id.trim(),
      status: data.status.trim(),
      shipping_address: data.shipping_address.trim(),
      sale_date: data.sale_date
        ? moment(data.sale_date).toISOString()
        : moment().toISOString(),
    };

    const newSale = await createSale(formattedData);
    if (newSale) {
      onAddSale(newSale);
      reset();
      await getSales();
      onClose();
    }
  };

  return (
    <Form {...createSaleForm}>
      <form
        onSubmit={handleSubmit(handleCreateSaleSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            control={control}
            name="bill_id"
            label="BILL ID"
            placeholder="Enter MR ID here."
          />
          <DateField control={control} name="sale_date" label="Date of Sale" />

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
                      <SelectValue placeholder={`Select Inventory...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-42 w-auto rounded-md border">
                      {inventoryOptions.map((inventory) => (
                        <SelectItem
                          className="capitalize"
                          key={inventory?.value}
                          value={inventory?.label}
                        >
                          {inventory?.label}
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
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select Customer...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-42 w-auto rounded-md border">
                      {customerOptions.map((customer) => (
                        <SelectItem
                          className="capitalize"
                          key={customer?.value}
                          value={customer?.value}
                        >
                          {customer?.label}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select Status.`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-42 w-auto rounded-md border">
                      {salesOptions.map((status) => (
                        <SelectItem
                          className="capitalize"
                          key={status}
                          value={status}
                        >
                          {status}
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
            name="shipping_address"
            label="Shipping Address"
            placeholder="Enter customer shipping address here."
          />
        </div>

        <div className="space-y-4">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4"
            >
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
                          <SelectValue placeholder={`Select Product...`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-42 w-auto rounded-md border">
                          {productOptions.map((product) => (
                            <SelectItem
                              className="capitalize"
                              key={product?.value}
                              value={product?.label}
                            >
                              {product?.label}
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
        </div>

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
          label="Create Sale"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
