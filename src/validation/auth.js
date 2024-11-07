import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(150, "Email must not exceed 150 characters"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/,
      "Password must be 8-32 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const registrationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(80, "Name must not exceed 80 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(150, "Email must not exceed 150 characters"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/,
      "Password must be 8-32 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(150, "Email must not exceed 150 characters"),
});


export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/,
      "Password must be 8-32 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/,
      "Password must be 8-32 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});