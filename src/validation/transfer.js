import { z } from "zod";

export const createTransferSchema = z.object({
  trf_id: z
    .string({
      required_error: "TRF ID is required",
    })
    .min(6, { message: "TRF ID be at least 6 characters long" })
    .max(20, { message: "TRF ID must not exceed 20 characters" }),
  transfer_date: z.date({
    required_error: "Transfer date is required",
  }),
  source_inventory: z
    .string({
      required_error: "Source inventory name is required",
    })
    .max(80, { message: "Source inventory name must not exceed 80 characters" })
    .nonempty({ message: "Source inventory name is required" }),
  destination_inventory: z
    .string({
      required_error: "Destination inventory is required",
    })
    .max(80, {
      message: "Destination inventory name must not exceed 80 characters",
    })
    .nonempty({ message: "Destination inventory name is required" }),
  products: z
    .array(
      z.object({
        mr_id: z
          .string({
            required_error: "MR ID is required",
          })
          .min(6, { message: "MR ID be at least 6 characters long" })
          .max(20, { message: "MR ID must not exceed 20 characters" }),
        product: z
          .string({
            required_error: "Product name is required",
          })
          .max(80, { message: "Product name must not exceed 80 characters" })
          .nonempty({ message: "Product name is required" }),
        quantity: z.coerce
          .number({
            required_error: "Product quantity is required",
            invalid_type_error: "Product quantity must be a Number",
          })
          .positive({ message: "Product quantity must be a positive number" })
          .int({ message: "Product quantity must be an integer" }),
      })
    )
    .min(1, "At least one product is required"),
});

export const updateTransferSchema = z.object({
  trf_id: z
    .string({
      required_error: "TRF ID is required",
    })
    .max(20, { message: "TRF ID must not exceed 20 characters" })
    .optional(),
  transfer_date: z.coerce
    .date({
      required_error: "Transfer date is required",
    })
    .optional(),
  source_inventory: z
    .string({
      required_error: "Source inventory name is required",
    })
    .max(80, { message: "Source inventory name must not exceed 80 characters" })
    .optional(),
  destination_inventory: z
    .string({
      required_error: "Destination inventory is required",
    })
    .max(80, {
      message: "Destination inventory name must not exceed 80 characters",
    })
    .optional(),
  products: z
    .array(
      z.object({
        mr_id: z
          .string({
            required_error: "MR ID is required",
          })
          .min(6, { message: "MR ID be at least 6 characters long" })
          .max(20, { message: "MR ID must not exceed 20 characters" }),
        product: z
          .string({
            required_error: "Product name is required",
          })
          .max(80, { message: "Product name must not exceed 80 characters" })
          .nonempty({ message: "Product name is required" }),
        quantity: z.coerce
          .number({
            required_error: "Product quantity is required",
            invalid_type_error: "Product quantity must be a Number",
          })
          .positive({ message: "Product quantity must be a positive number" })
          .int({ message: "Product quantity must be an integer" }),
      })
    )
    .optional(),
});
