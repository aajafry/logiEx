/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { DateField, InputField, SelectField } from "@/molecules";
import { useInventories, useTransfers } from "@/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/components/ui/select";
import { createTransferSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LoadingButton } from "@/atoms";

export const CreateTransferForm = ({ onAddTransfer, onClose }) => {
  const [mrIds, setMrIds] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const { loading, getTransfers, createTransfer } = useTransfers();
  const { inventories, getInventories, getInventory } = useInventories();

  const inventoryOptions = useMemo(
    () =>
      inventories.map((inventory) => ({
        value: inventory.id,
        label: inventory.name,
      })),
    [inventories]
  );

  const loadInventories = useCallback(
    async () => await getInventories(),
    [getInventories]
  );

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

  const createTransferForm = useForm({
    resolver: zodResolver(createTransferSchema),
  });

  const { reset, watch, handleSubmit, control } = createTransferForm;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "products",
  });

  const inventoryMrIds = useCallback(
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

      const mrIds = uniqueMrIds?.map((product, index) => ({
        value: product?.id || index,
        label: product?.mr_id,
      }));
      setMrIds(mrIds || []);
    },
    [getInventory]
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const inventoryName = value.source_inventory;
      if (inventoryName) {
        inventoryMrIds(inventoryName);
      }
    });
    return () => subscription.unsubscribe();
  }, [inventoryMrIds, watch]);

  const handleMrIdChange = async (index, mrId) => {
    const inventoryName = watch("source_inventory");
    const { inventories: storage } = await getInventory(inventoryName);
    const products = storage?.filter((product) => product.mr_id === mrId);

    setProductNames((prevProductNames) => {
      const newProductNames = [...prevProductNames];
      newProductNames[index] =
        products?.map((product) => ({
          value: product?.id,
          label: product.product,
        })) || [];
      return newProductNames;
    });
  };

  const handleCreateTransferSubmit = async (data) => {
    const formattedData = {
      ...data,
      transfer_date: data.transfer_date
        ? moment(data.transfer_date).toISOString()
        : moment().toISOString(),
    };

    const newTransfer = await createTransfer(data);
    if (newTransfer) {
      onAddTransfer(newTransfer);
      reset();
      await getTransfers();
      onClose();
    }
  };

  return (
    <Form {...createTransferForm}>
      <form
        onSubmit={handleSubmit(handleCreateTransferSubmit)}
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

          <FormField
            control={createTransferForm.control}
            name="source_inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Inventory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an inventory..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventoryOptions.map((inventory) => (
                      <SelectItem
                        className="capitalize"
                        key={inventory.value}
                        value={inventory.label}
                      >
                        {inventory.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createTransferForm.control}
            name="destination_inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Inventory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an inventory..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventoryOptions.map((inventory) => (
                      <SelectItem
                        className="capitalize"
                        key={inventory.value}
                        value={inventory.label}
                      >
                        {inventory.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
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
                        {mrIds.map((mrId) => (
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
                        {productNames[index]?.map((product) => (
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
                  onClick={() => remove(index)}
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
          onClick={() => append({ mr_id: "", product: "", quantity: "" })}
        >
          Add Item
        </Button>
        <br />
        <LoadingButton
          className="!mt-4" 
          label="Create Transfer"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
