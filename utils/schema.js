import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required.")
    .max(500, "Max 500 characters."),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    username: z.string().min(1, { message: "username is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email("Invalid email format"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email format"),
});

export const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required."),
  bio: z.string().max(500, "Bio must be less than 500 characters.").optional(),
  location: z.string().max(100, "Location must be less than 100 characters.").optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters.").optional(),
  website: z.string().url("Invalid website URL.").optional().or(z.literal("")),
  occupation: z.string().max(100, "Occupation must be less than 100 characters.").optional(),
}); 