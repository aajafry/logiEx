import { priceValidation, salesStatusEnum } from "@/utilities";
import { z } from "zod";

export const createSaleSchema = z.object({
  bill_id: z
    .string({
      required_error: "Bill ID is required",
    })
    .max(20, { message: "BILL ID must not exceed 20 characters" })
    .nonempty({ message: "BILL ID is required" }),
  sale_date: z.date({
    required_error: "Sale date is required",
  }),
  customer_id: z
    .string({
      required_error: "Customer ID is required",
    })
    .uuid({ message: "Invalid customer ID" })
    .min(1, { message: "Customer ID is required" }),
  shipping_address: z
    .string({
      required_error: "Shipping address is required",
    })
    .max(255, { message: "Address must not exceed 255 characters" })
    .nonempty({ message: "Address is required" }),
  status: z.enum(salesStatusEnum).optional(),
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

export const updateSaleSchema = z.object({
  bill_id: z
    .string()
    .max(20, { message: "BILL ID must not exceed 20 characters" })
    .optional(),
  sale_date: z.coerce
    .date({
      required_error: "Sale date is required",
    })
    .optional(),
  customer_id: z.string().uuid({ message: "Invalid customer ID" }).optional(),
  shipping_address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters" })
    .optional(),
  status: z.enum(salesStatusEnum).optional(),
  inventory: z
    .string({
      required_error: "Inventory name is required",
    })
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
    .number({ invalid_type_error: "Adjustment must be a number" })
    .optional(),
});
