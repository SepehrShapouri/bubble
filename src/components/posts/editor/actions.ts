"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await db.post.create({
    data: { content, userId: user.id },
    include: getPostDataInclude(user.id),
  });
  return newPost;
}
