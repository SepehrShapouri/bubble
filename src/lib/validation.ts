import { z } from "zod";
const requiredString = z.string().trim().min(1, "Required");
export const authSchema = z.object({
  email: requiredString.email("Invalid email address").optional(),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed",
  ),
  password: requiredString.min(8, "Password must be atleast 8 characters"),
});
export type AuthSchemaValues = z.infer<typeof authSchema>;
