import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    Followers: {
      where: { followerId: loggedInUserId },
      select: { followerId: true },
    },
    _count: { select: { Followers: true, posts: true ,Following:true} },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    Like: {
      where: {
        userId: loggedInUserId,
      },
      select: { userId: true },
    },
    Bookmark: {
      where: {
        userId: loggedInUserId,
      },
      select: { userId: true },
    },
    _count: {
      select: {
        Like: true,
        Comment: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type PostsPage = {
  posts: PostData[];
  nextCursor: string | null;
};

export type FollowerInfo = {
  followers: number;
  isFollowedByUser: boolean;
};
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export type LikeInfo = {
  likes: number;
  isLikedByUser: boolean;
};

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type CommentPage = {
  comments: CommentData[];
  previousCursor: string | null;
};
