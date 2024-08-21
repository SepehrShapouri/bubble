import { useEffect } from "react";
import { z } from "zod";
const requiredString = z.string().trim().min(1, "Required");
export const signupSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed",
  ),
  password: requiredString.min(8, "Password must be atleast 8 characters"),
});

export type signupSchemaValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type loginSchemaValues = z.infer<typeof loginSchema>;
export type authSchemaValues = loginSchemaValues | signupSchemaValues
