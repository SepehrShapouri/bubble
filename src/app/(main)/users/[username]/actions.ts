"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  updateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: updateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });
  return updatedUser;
}
