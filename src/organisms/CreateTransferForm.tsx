import { DateField, LoadingButton } from "@/atoms";
import { useInventories, useTransfers } from "@/hooks";
import { ITransfer } from "@/interfaces";
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
import { createTransferSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const CreateTransferForm = ({
  onAddTransfer,
  onClose,
}: {
  onAddTransfer: (transfer: ITransfer) => void;
  onClose: () => void;
}) => {
  const [mrIds, setMrIds] = useState<
    { value: string | number; label: string }[]
  >([]);
  const [productNames, setProductNames] = useState<
    { value: string; label: string }[][]
  >([]);
  const { loading, getTransfers, createTransfer } = useTransfers();
  const { inventories, getInventories, getInventory } = useInventories();

  const inventoryOptions: {
    value: string;
    label: string;
  }[] = useMemo(
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

  const createTransferForm = useForm<ITransfer>({
    resolver: zodResolver(createTransferSchema),
  });

  const { reset, watch, handleSubmit, control } = createTransferForm;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "products",
  });

  const inventoryMrIds = useCallback(
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

  const handleMrIdChange = async (index: number, mrId: string) => {
    const inventoryName = watch("source_inventory");
    const data = await getInventory(inventoryName);
    const storage = data?.inventories;
    const products = storage?.filter((product) => product.mr_id === mrId);
    console.log(products);

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

  const handleCreateTransferSubmit = async (data: ITransfer) => {
    const formattedData = {
      ...data,
      trf_id: data.trf_id.trim(),
      transfer_date: data.transfer_date
        ? moment(data.transfer_date).toISOString()
        : moment().toISOString(),
      source_inventory: data.source_inventory.trim(),
      destination_inventory: data.destination_inventory.trim(),
    };

    const newTransfer = await createTransfer(formattedData);
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
                      <SelectValue placeholder="Select an Inventory..." />
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
                      <SelectValue placeholder="Select an Inventory..." />
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
                          <SelectValue placeholder="Select a MR ID..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-44 w-auto rounded-md border">
                          {mrIds.map((mrId) => (
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
                          <SelectValue placeholder="Select a Product..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-44 w-auto rounded-md border">
                          {Array.isArray(productNames[index]) &&
                            productNames[index].map((product) => (
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
          onClick={() =>
            append({
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
          className="!mt-4"
          label="Create Transfer"
          size="sm"
          disabled={loading}
        />
      </form>
    </Form>
  );
};
