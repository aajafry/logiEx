/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { DateField, InputField, SelectField } from "@/molecules";
import { useInventories, useTransfers } from "@/hooks";

import { LoadingButton } from "@/atoms";
import { Button } from "@/shadcn/components/ui/button";
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
import { updateTransferSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const UpdateTransferFrom = ({
  transferTrfId,
  onUpdateTransfer,
  onClose,
}) => {
  const [mrIdOptions, setMrIdOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const {
    loading,
    getTransfer,
    getTransfers,
    updateTransfer,
    updateTransferProduct,
    deleteTransferProduct,
  } = useTransfers();
  const { getInventory } = useInventories();

  const updateTransferForm = useForm({
    resolver: zodResolver(updateTransferSchema),
  });
  const { reset, watch, setValue, getValues, control, handleSubmit } =
    updateTransferForm;

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

  const loadTransferData = useCallback(async () => {
    const transfer = await getTransfer(transferTrfId);
    if (transfer) {
      setValue("trf_id", transfer.trf_id || "");
      setValue("transfer_date", transfer.transfer_date || "");
      setValue("source_inventory", transfer.source_inventory || "");
      setValue("destination_inventory", transfer.destination_inventory || "");
      setValue("existingProducts", transfer.products || "");
    }
  }, [getTransfer, setValue, transferTrfId]);

  useEffect(() => {
    loadTransferData();
  }, [loadTransferData]);

  const loadInventoryData = useCallback(
    async (name) => {
      if (!name) return;
      const { inventories: storage } = await getInventory(name);

      const seenMrIds = new Set();

      const uniqueMrIds = storage?.filter((product) => {
        if (seenMrIds.has(product?.mr_id)) {
          return false;
        }
        seenMrIds.add(product?.mr_id);
        return true;
      });

      const mrIdOptions = uniqueMrIds?.map((product, index) => ({
        value: product?.id || index,
        label: product?.mr_id,
      }));
      setMrIdOptions(mrIdOptions || []);
    },
    [getInventory]
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const inventoryName = value.source_inventory;
      if (inventoryName) {
        loadInventoryData(inventoryName);
      }
    });
    return () => subscription.unsubscribe();
  }, [loadInventoryData, watch]);

  const handleMrIdChange = async (index, mrId) => {
    const inventoryName = watch("source_inventory");
    const { inventories: storage } = await getInventory(inventoryName);
    const products = storage?.filter((product) => product.mr_id === mrId);

    setProductOptions((prevProductNames) => {
      const newProductNames = [...prevProductNames];
      newProductNames[index] =
        products?.map((product) => ({
          value: product?.id,
          label: product.product,
        })) || [];
      return newProductNames;
    });
  };

  const handleUpdateTransferSubmit = async (data) => {
    const formattedData = {
      ...data,
      transfer_date: data.transfer_date
        ? moment(data.transfer_date).toISOString()
        : moment().toISOString(),
      products: data.products?.length === 0 ? null : data.products,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    const updatedTransfer = await updateTransfer(transferTrfId, validData);
    if (updatedTransfer) {
      onUpdateTransfer(updatedTransfer);
      reset();
      await getTransfers();
      onClose();
    }
  };

  const handleUpdateExistingProduct = async (index) => {
    const product = getValues(`existingProducts.${index}`);
    const { id } = product;
    const formattedData = {
      quantity: product.quantity > 0 ? parseInt(product.quantity) : null,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    await updateTransferProduct(id, validData);
  };

  const handleRemoveExistingProduct = async (index) => {
    const productId = getValues(`existingProducts.${index}.id`);

    const deletedTransferProduct = await deleteTransferProduct(productId);
    if (deletedTransferProduct) {
      removeExistingField(index);
    }
  };

  const { role } = getUser();

  return (
    <Form {...updateTransferForm}>
      <form
        onSubmit={handleSubmit(handleUpdateTransferSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            control={control}
            name="trf_id"
            label="TRF ID"
            placeholder="Enter TRF ID here."
          />

          <DateField
            control={control}
            name="transfer_date"
            label="Date of Transfer"
          />

          <InputField
            control={control}
            name="source_inventory"
            label="Source Inventory"
            placeholder="Enter source inventory"
            disabled={true}
          />

          <InputField
            control={control}
            name="destination_inventory"
            label="Destination Inventory"
            placeholder="Enter destination inventory"
            disabled={true}
          />
        </div>

        <div className="space-y-2">
          {existingProductFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <InputField
                control={control}
                name={`existingProducts.${index}.mr_id`}
                label="MR ID"
                placeholder="Enter MR ID (e.g., MR-2024-000)"
                disabled={true}
              />

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
                placeholder="Enter product quantity here."
              />

              {/* Update and Remove Buttons */}
              <div className="flex justify-end space-x-2 sm:col-span-2 lg:col-span-1">
                <LoadingButton
                  size="sm"
                  type="button"
                  label="Update"
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-400"
                  onClick={() => handleUpdateExistingProduct(index)}
                />

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
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-4"
            >
              <FormField
                control={control}
                name={`products.${index}.mr_id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MR ID</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleMrIdChange(index, value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an MR ID..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mrIdOptions.map((mrId) => (
                          <SelectItem
                            className="capitalize"
                            key={mrId.value}
                            value={mrId.label}
                          >
                            {mrId.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <SelectValue placeholder="Select an product..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productOptions[index]?.map((product) => (
                          <SelectItem
                            className="capitalize"
                            key={product.value}
                            value={product.label}
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
                placeholder="Enter product quantity here."
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

        <Button
          className="bg-emerald-500 hover:bg-emerald-400"
          type="button"
          size="sm"
          onClick={() =>
            appendNewProduct({
              mr_id: "",
              product: "",
              quantity: "",
            })
          }
        >
          Add Item
        </Button>

        <br />

        <LoadingButton
          className="!mt-4 bg-blue-500 hover:bg-blue-400"
          label="Update Purchase"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
