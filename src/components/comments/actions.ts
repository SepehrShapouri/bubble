"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { CommentPage, getCommentDataInclude, PostData } from "@/lib/types";
import { commentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthenticated");

  const { content: validatedContent } = commentSchema.parse({ content });
  const newComment = await db.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });
  return newComment;
}

export async function getPostComments({
  postId,
  cursor,
}: {
  postId: string;
  cursor: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthenticated");
  const pageNumber = 5;

  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    include: getCommentDataInclude(user.id),
    orderBy: {
      createdAt: "asc",
    },
    take: -pageNumber - 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const previousCursor = comments.length > pageNumber ? comments[0].id : null;

  const data: CommentPage = {
    comments: comments.length > pageNumber ? comments.slice(1) : comments,
    previousCursor,
  };

  return data;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthenticated");

  const comment = await db.comment.findUnique({ where: { id } });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await db.comment.delete({
    where: { id },
    include:getCommentDataInclude(user.id)
  });

  return deletedComment
}
