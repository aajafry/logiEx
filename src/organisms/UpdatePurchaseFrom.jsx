/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { DateField, InputField, SelectField } from "@/molecules";
import { useInventories, useProducts, useVendors } from "@/hooks";
import { usePurchases } from "@/hooks/usePurchases";
import { Button } from "@/shadcn/components/ui/button";

import { LoadingButton } from "@/atoms";
import { Calendar } from "@/shadcn/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { cn } from "@/shadcn/lib/utils";
import { getUser } from "@/utilities";
import { updatePurchaseSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const UpdatePurchaseFrom = ({
  purchaseMrId,
  onUpdatePurchase,
  onClose,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const {
    loading,
    getPurchase,
    getPurchases,
    updatePurchase,
    updatePurchaseProduct,
    deletePurchaseProduct,
  } = usePurchases();
  const { vendors, getVendors } = useVendors();
  const { products, getProducts } = useProducts();
  const { inventories, getInventories } = useInventories();

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        value: vendor.id,
        label: vendor.name,
      })),
    [vendors]
  );

  const inventoryOptions = useMemo(
    () =>
      inventories.map((inventory) => ({
        value: inventory.id,
        label: inventory.name,
      })),
    [inventories]
  );

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: product.id,
        label: product.name,
      })),
    [products]
  );

  const updatePurchaseForm = useForm({
    resolver: zodResolver(updatePurchaseSchema),
  });

  const { reset, watch, setValue, getValues, control, handleSubmit } =
    updatePurchaseForm;

  const loadPurchaseData = useCallback(async () => {
    const purchase = await getPurchase(purchaseMrId);

    if (purchase) {
      setValue("mr_id", purchase.mr_id || "");
      setValue("purchase_date", purchase.purchase_date || "");
      setValue("vendor", purchase.vendor || "");
      setValue("inventory", purchase.inventory || "");
      setValue("adjustment", purchase.adjustment || "");
      setValue("total_price", purchase.total_price || "");
      setValue("existingProducts", purchase.products || "");
    }
  }, [getPurchase, purchaseMrId, setValue]);

  const loadVendors = useCallback(() => getVendors(), [getVendors]);
  const loadProducts = useCallback(() => getProducts(), [getProducts]);
  const loadInventories = useCallback(() => getInventories(), [getInventories]);

  useEffect(() => {
    loadPurchaseData();
    loadVendors();
    loadProducts();
    loadInventories();
  }, [loadInventories, loadProducts, loadPurchaseData, loadVendors]);

  const {
    fields: existingProductFields,
    update: updateExistingField,
    remove: removeExistingField,
  } = useFieldArray({
    control,
    name: "existingProducts",
  });

  const {
    fields: newProductFields,
    append: appendNewProduct,
    remove: removeNewProduct,
  } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const adjustment = value.adjustment || 0;

      const existingProductsTotal = value.existingProducts?.reduce(
        (acc, product) => {
          const quantity = parseFloat(product.quantity) || 0;
          const unitPrice = parseFloat(product.unit_price) || 0;
          const discount = parseFloat(product.discount) || 0;

          const itemTotal = quantity * unitPrice * ((100 - discount) / 100);

          return acc + itemTotal;
        },
        0
      );

      const newProductsTotal = value.products?.reduce((acc, product) => {
        const quantity = parseFloat(product.quantity) || 0;
        const unitPrice = parseFloat(product.unit_price) || 0;
        const discount = parseFloat(product.discount) || 0;

        const itemTotal = quantity * unitPrice * ((100 - discount) / 100);

        return acc + itemTotal;
      }, 0);

      const adjustmentValue = parseFloat(adjustment) || 0;
      const totalWithAdjustment =
        existingProductsTotal + newProductsTotal - adjustmentValue;

      setTotalPrice(totalWithAdjustment >= 0 ? totalWithAdjustment : 0);
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  useEffect(() => {
    setValue("total_price", totalPrice.toFixed(3));
  }, [setValue, totalPrice]);

  const handleUpdatePurchaseSubmit = async (data) => {
    const formattedData = {
      ...data,
      purchase_date: data.purchase_date
        ? moment(data.purchase_date).toISOString()
        : moment().toISOString(),
      products: data.products?.length === 0 ? null : data.products,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    const updatedPurchase = await updatePurchase(purchaseMrId, validData);
    if (updatedPurchase) {
      onUpdatePurchase(updatedPurchase);
      reset();
      await getPurchases();
      onClose();
    }
  };

  const handleUpdateExistingProduct = async (index) => {
    const product = getValues(`existingProducts.${index}`);
    const { id } = product;
    const formattedData = {
      quantity: product.quantity > 0 ? parseInt(product.quantity) : null,
      unit_price:
        product.unit_price > 0 ? parseFloat(product.unit_price) : null,
      discount: product.discount > 0 ? parseFloat(product.discount) : null,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );
    await updatePurchaseProduct(id, validData);
  };

  const handleRemoveExistingProduct = async (index) => {
    const productId = getValues(`existingProducts.${index}.id`);
    const deletedPurchaseProduct = await deletePurchaseProduct(productId);
    if (deletedPurchaseProduct) {
      removeExistingField(index);
    }
  };

  const { role } = getUser();

  return (
    <Form {...updatePurchaseForm}>
      <form
        onSubmit={handleSubmit(handleUpdatePurchaseSubmit)}
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
            render={({ field }) => {
              if (field.value) {
                return (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select Vendor.`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendorOptions.map((vendor) => (
                          <SelectItem
                            className="capitalize"
                            key={vendor?.value}
                            value={vendor?.label}
                          >
                            {vendor?.label}
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
                    <FormLabel>Vendor</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
          />

          <FormField
            control={control}
            name="inventory"
            render={({ field }) => {
              if (field.value) {
                return (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select Inventory.`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inventoryOptions.map((inventory) => (
                          <SelectItem
                            className="capitalize"
                            key={inventory?.value}
                            value={inventory?.label}
                          >
                            {inventory?.label}
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
                    <FormLabel>Inventory</FormLabel>
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" />
                      Please wait
                    </span>
                  </FormItem>
                );
              }
            }}
          />
        </div>

        <div className="space-y-2">
          {existingProductFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
            >
              <InputField
                control={control}
                name={`existingProducts.${index}.product`}
                label="Product"
                disabled={true}
                placeholder="Enter product name"
              />

              <InputField
                control={control}
                name={`existingProducts.${index}.quantity`}
                label="Quantity"
                placeholder="Enter quantity (e.g., 5)"
              />

              <InputField
                control={control}
                name={`existingProducts.${index}.unit_price`}
                label="Unit Price"
                placeholder="Enter unit price (e.g., 100.00)"
              />
              <InputField
                control={control}
                name={`existingProducts.${index}.discount`}
                label="Discount (%)"
                placeholder="Enter discount (e.g., 10)"
              />

              {/* Update and Remove Buttons */}
              <div className="flex justify-end space-x-2 sm:col-span-2 lg:col-span-1">
                {["admin", "procurement-manager"].includes(role) && (
                  <LoadingButton
                    size="sm"
                    type="button"
                    label="Update"
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-400"
                    onClick={() => handleUpdateExistingProduct(index)}
                  />
                )}

                {["admin"].includes(role) && (
                  <LoadingButton
                    size="sm"
                    type="button"
                    label="Remove"
                    disabled={loading}
                    variant="destructive"
                    onClick={() => handleRemoveExistingProduct(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {newProductFields.map((item, index) => (
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
                          <SelectValue placeholder={`Select Product.`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productOptions.map((product) => (
                          <SelectItem
                            className="capitalize"
                            key={product?.value}
                            value={product?.label}
                          >
                            {product?.label}
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
                name={`products.${index}.quantity`}
                label="Quantity"
                placeholder="Enter quantity (e.g., 5)"
              />

              <InputField
                control={control}
                name={`products.${index}.unit_price`}
                label="Unit Price"
                placeholder="Enter unit price (e.g., 100.00)"
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
                  onClick={() => removeNewProduct(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {["admin", "procurement-manager"].includes(role) && (
          <Button
            className="bg-emerald-500 hover:bg-emerald-400"
            type="button"
            size="sm"
            onClick={() =>
              appendNewProduct({
                product: "",
                quantity: "",
                unit_price: "",
                discount: "",
              })
            }
          >
            Add Item
          </Button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <InputField
            control={control}
            name="adjustment"
            label="Adjustment (use Amount)"
            placeholder="Enter adjustment price (e.g., 100.00)"
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
              </FormItem>
            )}
          />
        </div>

        {["admin", "procurement-manager"].includes(role) && (
          <LoadingButton
            className="!mt-4 bg-blue-500 hover:bg-blue-400"
            label="Update Purchase"
            size="sm"
            disabled={loading}
          />
        )}
      </form>
    </Form>
  );
};
