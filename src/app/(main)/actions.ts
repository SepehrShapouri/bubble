"use server";
import { db } from "@/lib/db";
import { postDataInclude } from "@/lib/types";

export async function getPosts() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postDataInclude,
  });
  return posts
}
