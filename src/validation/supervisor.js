import { z } from "zod";

export const createInventoryEmploymentSchema = z.object({
  hire_date: z.date({
    required_error: "Hire date is required",
  }),
  employee_id: z
    .string({
      required_error: "Employee ID is required",
    })
    .uuid({ message: "Invalid employee ID" }),
  inventory: z
    .string({
      required_error: "Inventory name is required",
    })
    .max(80, { message: "Inventory name must not exceed 80 characters" })
    .nonempty({ message: "Inventory name is required" }),
});

export const updateInventoryEmploymentSchema = z.object({
  transfer_date: z
    .date({
      required_error: "Hire date is required",
    })
    .optional(),
  resign_date: z
    .date({
      required_error: "Hire date is required",
    })
    .optional(),
  hire_date: z
    .date({
      termination_date: "Hire date is required",
    })
    .optional(),
});
