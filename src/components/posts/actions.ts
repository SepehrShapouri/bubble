"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude, LikeInfo } from "@/lib/types";

export async function deletePost(postId: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const postToDelete = await db.post.findUnique({ where: { id: postId } });

  if (!postToDelete) throw Error("Post not found");

  if (postToDelete.userId !== user.id) throw Error("Unauthorized");

  const deletedPost = await db.post.delete({
    where: { id: postId },
    include: getPostDataInclude(user.id),
  });
  return deletedPost;
}

export async function getPostLikes(postId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");

  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      Like: {
        where: {
          userId: loggedInUser.id,
        },
        select: { userId: true },
      },
      _count: {
        select: {
          Like: true,
        },
      },
    },
  });
  if (!post) {
    throw Error("Post not found");
  }

  const data: LikeInfo = {
    likes: post._count.Like,
    isLikedByUser: !!post.Like.length,
  };
  return data;
}

export async function likePost(postId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");

  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      userId: true,
    },
  });

  if (!post) throw Error("Post not found");
  try {
    await db.$transaction([
      db.like.upsert({
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
      }),
      ...(loggedInUser.id !== post.userId
        ? [
            db.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);
    // await db.like.upsert({
    //   where: {
    //     userId_postId: {
    //       userId: loggedInUser.id,
    //       postId,
    //     },
    //   },
    //   create: {
    //     userId: loggedInUser.id,
    //     postId,
    //   },
    //   update: {},
    // });

    // await db.notification.create({
    //   data: {
    //     issuerId: loggedInUser.id,
    //     recipientId: post.userId,
    //     postId,
    //     type: "LIKE",
    //   },
    // });
    return { message: "success" };
  } catch (error) {
    console.error(error);
    throw Error(`${error}`);
  }
}

export async function deleteLike(postId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");
  const post = await db.post.findUnique({
    where: { id: postId },
    select: {
      userId: true,
    },
  });
  if (!post) throw Error("Post not found");

  try {
    await db.$transaction([
      db.like.deleteMany({ where: { userId: loggedInUser.id, postId } }),
      db.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ]);
    return { message: "success" };
  } catch (error) {
    console.error(error);
    throw Error(`${error}`);
  }
}
