"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude, getUserDataSelect, PostsPage } from "@/lib/types";
import { cache } from "react";

export async function getUsersPost(userId: string, cursor: string) {
  
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

