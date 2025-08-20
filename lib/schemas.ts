import { z } from "zod";

/**
 * VALIDATION SCHEMA
 *
 * This Zod schema defines the validation rules. It ensures data quality and type safety before submission to the database.
 *
 * Key Features:
 * - Type checking and validation
 * - Custom error messages for better UX
 * - Business rule enforcement (loan amounts, email format, etc.)
 * - Phone number format validation
 * - Required field validation
 */
export const conversationalFormSchema = z.object({
  loanAmount: z
    .number({ invalid_type_error: "Loan amount must be a number" })
    .min(1000, "Loan amount must be at least $1,000")
    .max(40000, "Loan amount must be no more than $40,000"),
  loanType: z.string().min(1, "Loan type is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\+]?[0-9][\d\s\-\(\)]{7,15}$/,
      "Please enter a valid phone number"
    ),
  chatHistory: z.string().optional(),
});

// Type inference from the schema
export type FormData = z.infer<typeof conversationalFormSchema>;
