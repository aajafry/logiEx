import { DateField, LoadingButton } from "@/atoms";
import { useInventories, useTransfers } from "@/hooks";
import { ITransfer, ITransferProduct } from "@/interfaces";
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
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { getUser } from "@/utilities";
import { updateTransferSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const UpdateTransferFrom = ({
  transferTrfId,
  onUpdateTransfer,
  onClose,
}: {
  transferTrfId: string;
  onUpdateTransfer: (transfer: ITransfer) => void;
  onClose: () => void;
}) => {
  const [mrIdOptions, setMrIdOptions] = useState<
    {
      value: string | number;
      label: string;
    }[]
  >([]);
  const [productOptions, setProductOptions] = useState<
    {
      value: string;
      label: string;
    }[][]
  >([]);

  const {
    loading,
    getTransfer,
    getTransfers,
    updateTransfer,
    updateTransferProduct,
    deleteTransferProduct,
  } = useTransfers();
  const { getInventory } = useInventories();

  const updateTransferForm = useForm<ITransfer>({
    resolver: zodResolver(updateTransferSchema),
  });
  const { reset, watch, setValue, getValues, control, handleSubmit } =
    updateTransferForm;

  const { fields: existingProductFields, remove: removeExistingField } =
    useFieldArray({
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
      setValue("existingProducts", transfer.products as ITransferProduct[]);
    }
  }, [getTransfer, setValue, transferTrfId]);

  useEffect(() => {
    loadTransferData();
  }, [loadTransferData]);

  const loadInventoryData = useCallback(
    async (name: string) => {
      if (!name) return;
      const data = await getInventory(name);
      const storage = data?.inventories;

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

  const handleMrIdChange = async (index: number, mrId: string) => {
    const inventoryName = watch("source_inventory");
    const data = await getInventory(inventoryName);
    const storage = data?.inventories;
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

  const handleUpdateTransferSubmit = async (data: ITransfer) => {
    const formattedData = {
      ...data,
      trf_id: data.trf_id.trim(),
      transfer_date: data.transfer_date
        ? moment(data.transfer_date).toISOString()
        : moment().toISOString(),
      source_inventory: data.source_inventory.trim(),
      destination_inventory: data.destination_inventory.trim(),
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

  const handleUpdateExistingProduct = async (index: number) => {
    const product = getValues(`existingProducts.${index}`);
    const { id } = product;
    const formattedData = {
      quantity:
        product.quantity > 0 ? parseInt(product.quantity.toString()) : null,
    };

    const validData = Object.fromEntries(
      Object.entries(formattedData).filter(([, value]) => value !== null)
    );

    await updateTransferProduct(id, validData);
  };

  const handleRemoveExistingProduct = async (index: number) => {
    const productId = getValues(`existingProducts.${index}.id`);

    const deletedTransferProduct = await deleteTransferProduct(productId);
    if (deletedTransferProduct) {
      removeExistingField(index);
    }
  };

  const user = getUser();
  const role = user?.role;

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

                {role && ["admin", "inventory-manager"].includes(role) && (
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
                        <ScrollArea className="h-42 w-auto rounded-md border">
                          {mrIdOptions.map((mrId) => (
                            <SelectItem
                              className="capitalize"
                              key={mrId.value}
                              value={mrId.label}
                            >
                              {mrId.label}
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
                        <ScrollArea className="h-42 w-auto rounded-md border">
                          {Array.isArray(productOptions[index]) &&
                            productOptions[index]?.map((product) => (
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
              quantity: 0,
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
