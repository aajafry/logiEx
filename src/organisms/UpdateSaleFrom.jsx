/* eslint-disable react/prop-types */
import { DateField, InputField } from "@/molecules";
import { useCustomers, useInventories, useSales } from "@/hooks";
import { Button } from "@/shadcn/components/ui/button";
import { LoadingButton } from "@/atoms";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { getUser, salesStatusEnum as salesOptions } from "@/utilities";
import { updateSaleSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

/* eslint-disable no-unused-vars */
export const UpdateSaleFrom = ({ saleBillId, onUpdateSale, onClose }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [inventory, setInventory] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const { customers, getCustomers } = useCustomers();
  const { inventories, getInventories, getInventory } = useInventories();
  const {
    loading,
    getSale,
    getSales,
    updateSale,
    updateSaleProduct,
    deleteSaleProduct,
  } = useSales();
  const { role } = getUser();

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        value: customer.id,
        label: `${customer.name} (${customer.email})`,
      })),
    [customers]
  );

  const updateSaleForm = useForm({
    resolver: zodResolver(updateSaleSchema),
  });

  const { reset, watch, setValue, getValues, control, handleSubmit } =
    updateSaleForm;

  const loadSaleData = useCallback(async () => {
    const sale = await getSale(saleBillId);
    if (sale) {
      setValue("bill_id", sale.bill_id || "");
      setValue("sale_date", sale.sale_date || "");
      setValue("inventory", sale.inventory || "");
      setValue("customer_id", sale.customer?.id || "");
      setValue("status", sale.status || "");
      setValue("shipping_address", sale.shipping_address || "");
      setValue("existingProducts", sale.products || "");
      setValue("adjustment", sale.adjustment || "");
      setValue("total_price", sale.total_price || "");
      setInventory(sale.products[0].inventory || "");
    }
  }, [getSale, saleBillId, setValue]);

  const loadCustomers = useCallback(
    async () => await getCustomers(),
    [getCustomers]
  );

  const fetchProductOptions = useCallback(async () => {
    if (
      inventory &&
      ["admin", "inventory-manager", "inventory-in-charge"].includes(role)
    ) {
      const product = await getInventory(inventory);
      if (product?.inventories) {
        const options = product.inventories.map((prod) => ({
          value: prod.id,
          label: prod.product,
        }));
        setProductOptions(options);
      }
    }
  }, [getInventory, inventory, role]);

  useEffect(() => {
    fetchProductOptions();
  }, [fetchProductOptions, inventory]);

  useEffect(() => {
    loadSaleData();
    loadCustomers();
  }, [loadCustomers, loadSaleData]);

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

  const handleUpdateSaleSubmit = async (data) => {
    const formattedData = {
      ...data,
      sale_date: data.sale_date
        ? moment(data.sale_date).toISOString()
        : moment().toISOString(),
      products: data.products?.length === 0 ? null : data.products,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    const updatedSale = await updateSale(saleBillId, validData);
    if (updatedSale) {
      onUpdateSale(updatedSale);
      reset();
      await getSales();
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
    await updateSaleProduct(id, validData);
  };

  const handleRemoveExistingProduct = async (index) => {
    const productId = getValues(`existingProducts.${index}.id`);
    const deletedPurchaseProduct = await deleteSaleProduct(productId);
    if (deletedPurchaseProduct) {
      removeExistingField(index);
    }
  };

  return (
    <Form {...updateSaleForm}>
      <form
        onSubmit={handleSubmit(handleUpdateSaleSubmit)}
        className="space-y-6"
      >
        <div className=" space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              control={control}
              name="bill_id"
              label="BILL ID"
              placeholder="Enter MR ID here."
            />
            <DateField
              control={control}
              name="sale_date"
              label="Date of Sale"
            />
            <InputField
              control={control}
              name="inventory"
              label="Inventory"
              disabled={true}
              placeholder="Enter an inventory name"
            />

            <FormField
              control={control}
              name="customer_id"
              render={({ field }) => {
                if (field.value) {
                  return (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Customer." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customerOptions.map((option) => (
                            <SelectItem
                              className="capitalize"
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
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
                      <FormLabel>Customer</FormLabel>
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
                      {salesOptions.map((status) => (
                        <SelectItem
                          className="capitalize"
                          key={status}
                          value={status}
                        >
                          {status}
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
              name="shipping_address"
              label="Shipping Address"
              placeholder="Enter customer shipping address here."
              disabled={["fleet-manager", "captain"].includes(role)}
            />
          </div>
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
                placeholder="Enter product name"
                disabled={true}
              />

              <InputField
                control={control}
                name={`existingProducts.${index}.quantity`}
                label="Quantity"
                placeholder="Enter quantity (e.g., 5)"
                disabled={["fleet-manager", "captain"].includes(role)}
              />

              <InputField
                control={control}
                name={`existingProducts.${index}.unit_price`}
                label="Unit Price"
                placeholder="Enter unit price (e.g., 100.00)"
                disabled={["fleet-manager", "captain"].includes(role)}
              />

              <InputField
                control={control}
                name={`existingProducts.${index}.discount`}
                label="Unit Price"
                placeholder="Enter discount (e.g., 10)"
                disabled={["fleet-manager", "captain"].includes(role)}
              />

              {/* Update and Remove Buttons */}
              <div className="flex justify-end space-x-2 sm:col-span-2 lg:col-span-1">
                {["admin", "inventory-manager", "inventory-in-charge"].includes(
                  role
                ) && (
                  <LoadingButton
                    size="sm"
                    type="button"
                    label="Update"
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-400"
                    onClick={() => handleUpdateExistingProduct(index)}
                  />
                )}

                {["admin", "inventory-manager"].includes(role) && (
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
                            <SelectValue placeholder="Select a product..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productOptions.map((product, index) => (
                            <SelectItem
                              key={product.value}
                              value={product.label}
                              className="capitalize"
                            >
                              {product.label}
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
                  placeholder="Enter discount (e.g., 10)"
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
            </div>
          ))}
        </div>

        {["admin", "inventory-manager", "inventory-in-charge"].includes(
          role
        ) && (
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
            placeholder="Enter adjustment amount here."
            disabled={["fleet-manager", "captain"].includes(role)}
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

        {[
          "admin",
          "inventory-manager",
          "inventory-in-charge",
          "fleet-manager",
          "captain",
        ].includes(role) && (
          <LoadingButton
            className="!mt-4 bg-blue-500 hover:bg-blue-400"
            label="Update Sale"
            size="sm"
            disabled={loading}
          />
        )}
      </form>
    </Form>
  );
};
