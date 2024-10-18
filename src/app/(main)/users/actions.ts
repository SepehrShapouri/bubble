"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getUserDataSelect } from "@/lib/types";
import { cache } from "react";

export const getUser = cache(async (username: string) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthorized");
  const user = await db.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUser.id),
  });

  if (!user) {
    return null;
  }

  return user;
});

