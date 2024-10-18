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

  const [newComment] = await db.$transaction([
    db.comment.create({
      data: {
        content: validatedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.user.id !== user.id
      ? [
          db.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              type: "COMMENT",
              postId: post.id,
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}


export async function deleteComment(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthenticated");

  const comment = await db.comment.findUnique({ where: { id } });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await db.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
