"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const postToDelete = await db.post.findUnique({ where: { id } });

  if (!postToDelete) throw Error("Post not found");

  if (postToDelete.userId !== user.id) throw Error("Unauthorized");

const deletedPost =  await db.post.delete({ where: { id } ,include:getPostDataInclude(user.id)});
 return deletedPost
}
