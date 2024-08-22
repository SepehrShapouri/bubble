"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  await db.post.create({ data: { content, userId: user.id } });
}
