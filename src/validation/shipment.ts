import { z } from "zod";
import { shipmentStatusEnum } from "@/utilities";

export const createShipmentSchema = z.object({
  shipment_id: z
    .string({
      required_error: "Shipment ID is required",
    })
    .max(20, { message: "Shipment ID must not exceed 20 characters" })
    .nonempty({ message: "Shipment ID is required" }),
  shipment_date: z.date({
    required_error: "Shipment date is required",
  }),
  vehicle_vin: z
    .string({
      required_error: "Vehicle VIN is required",
    })
    .max(20, { message: "Vehicle VIN must not exceed 20 characters" })
    .nonempty({ message: "Vehicle VIN is required" }),
  captain_id: z
    .string({
      required_error: "Captain ID is required",
    })
    .uuid({ message: "Invalid captain ID" })
    .min(1, { message: "Captain ID is required" }),
  status: z.enum(shipmentStatusEnum).optional(),
  orders: z
    .array(
      z.object({
        bill_id: z
          .string({
            required_error: "BILL ID is required",
          })
          .max(20, { message: "BILL ID must not exceed 20 characters" })
          .nonempty({ message: "BILL ID is required" }),
      })
    )
    .optional(),
});

export const updateShipmentSchema = z.object({
  shipment_id: z
    .string({
      required_error: "Shipment ID is required",
    })
    .max(20, { message: "Shipment ID must not exceed 20 characters" })
    .optional(),
  shipment_date: z.coerce
    .date({
      required_error: "Shipment date is required",
    })
    .optional(),
  vehicle_vin: z
    .string({
      required_error: "Vehicle VIN is required",
    })
    .max(20, { message: "Vehicle VIN must not exceed 20 characters" })
    .optional(),
  captain_id: z
    .string({
      required_error: "Captain ID is required",
    })
    .uuid({ message: "Invalid captain ID" })
    .optional(),
  status: z.enum(shipmentStatusEnum).optional(),
  orders: z
    .array(
      z.object({
        bill_id: z
          .string({
            required_error: "BILL ID is required",
          })
          .max(20, { message: "BILL ID must not exceed 20 characters" })
          .nonempty({ message: "BILL ID is required" }),
      })
    )
    .optional(),
});
