import { priceValidation } from "@/utilities";
import { z } from "zod";

export const createPurchaseSchema = z.object({
  mr_id: z
    .string({
      required_error: "MR ID is required",
    })
    .min(6, { message: "MR ID be at least 6 characters long" })
    .max(20, { message: "MR ID must not exceed 20 characters" }),
  purchase_date: z.date({
    required_error: "Purchase date is required",
  }),
  vendor: z
    .string({
      required_error: "Vendor name is required",
    })
    .max(80, { message: "Vendor name must not exceed 80 characters" })
    .nonempty({ message: "Vendor name is required" }),
  inventory: z
    .string({
      required_error: "Inventory name is required",
    })
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .nonempty({ message: "Inventory name is required" }),
  products: z
    .array(
      z.object({
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
        unit_price: z.coerce
          .number({
            required_error: "Product unit price is required",
            invalid_type_error: "Product unit price must be a Number",
          })
          .refine((value) => value !== undefined && value !== null, {
            message: "Unit price is required",
          })
          .refine((value) => priceValidation(value), {
            message:
              "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
          }),
        discount: z.coerce
          .number({
            invalid_type_error: "Product discount must be a Number",
          })
          .gte(0, { message: "Discount must have a minimum of zero percent" })
          .lte(100, {
            message: "Discount must have a maximum of hundred percent",
          })
          .optional(),
      })
    )
    .min(1, "At least one product is required"),
  adjustment: z.coerce
    .number({ invalid_type_error: "Adjustment must be a number" })
    .optional(),
});

export const updatePurchaseSchema = z.object({
  mr_id: z
    .string()
    .min(6, { message: "MR ID be at least 6 characters long" })
    .max(20, { message: "MR ID must not exceed 20 characters" })
    .optional(),
  purchase_date: z.coerce
    .date({
      required_error: "Purchase date is required",
    })
    .optional(),
  vendor: z
    .string()
    .max(80, { message: "Vendor name must not exceed 80 characters" })
    .optional(),
  inventory: z
    .string()
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .optional(),
  products: z
    .array(
      z.object({
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
        unit_price: z.coerce
          .number({
            required_error: "Product unit price is required",
            invalid_type_error: "Product unit price must be a Number",
          })
          .refine((value) => value !== undefined && value !== null, {
            message: "Unit price is required",
          })
          .refine((value) => priceValidation(value), {
            message:
              "Unit price must have a maximum of 10 digits in total and 3 digits after the decimal point",
          }),
        discount: z.coerce
          .number({
            invalid_type_error: "Product discount must be a Number",
          })
          .gte(0, { message: "Discount must have a minimum of zero percent" })
          .lte(100, {
            message: "Discount must have a maximum of hundred percent",
          })
          .optional(),
      })
    )
    .optional(),
  adjustment: z.coerce
    .number({
      invalid_type_error: "Product adjustment must be a Number",
    })
    .optional()
    .refine(
      (value) => {
        if (value === undefined || isNaN(value)) return true;
        return priceValidation(value);
      },
      {
        message:
          "Adjustment price must have a maximum of 10 digits in total and 3 digits after the decimal point",
      }
    ),
});
