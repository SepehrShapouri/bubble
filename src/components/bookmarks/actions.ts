"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { BookmarkInfo, getPostDataInclude, PostsPage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getBookmark(postId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");

  const bookmark = await db.bookmark.findUnique({
    where: {
      userId_postId: {
        userId: loggedInUser.id,
        postId,
      },
    },
  });

  const data: BookmarkInfo = {
    isBookmarkedByUser: !!bookmark,
  };
  return data;
}

export async function addBookmark(postId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");
  try {
    await db.bookmark.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });
    revalidatePath("/bookmarks")
    return { message: "success" };
  } catch (error) {
    console.error(error);
    throw Error(`${error}`);
  }
}

export async function deleteBookmark(postId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");
  try {
    await db.bookmark.deleteMany({
      where: { userId: loggedInUser.id, postId },
    });
    revalidatePath('/bookmarks')
    return { message: "success" };
  } catch (error) {
    console.error(error);
    throw Error(`${error}`);
  }
}

export async function getAllBookmarks(cursor: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const pageNumber = 10;

  const bookmarks = await db.bookmark.findMany({
    where: {
      userId: user.id,
    },
    include: {
      post: {
        include: getPostDataInclude(user.id),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageNumber + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor =
    bookmarks.length > pageNumber ? bookmarks[pageNumber].id : null;
  const data: PostsPage = {
    posts: bookmarks.slice(0, pageNumber).map((bookmark) => bookmark.post),
    nextCursor,
  };
  return data;
}
