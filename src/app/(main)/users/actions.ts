"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude, PostsPage } from "@/lib/types";

export async function getUsersPost(userId: string, cursor: string) {
  console.log(userId);
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const pageNumber = 10;
  const posts = await db.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: getPostDataInclude(user.id),
    take: pageNumber + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor = posts.length > pageNumber ? posts[pageNumber].id : null;
  const data: PostsPage = {
    posts: posts.slice(0, pageNumber),
    nextCursor,
  };
  return data;
}
