"use server";
import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude, getUserDataSelect, PostsPage } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

export async function getPosts(cursor: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const pageNumber = 10;
  const posts = await db.post.findMany({
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



export async function getFollowingPosts(cursor: string) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const pageNumber = 10;
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      user: {
        Followers: {
          some: {
            followerId: user.id,
          },
        },
      },
    },
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

export async function getUsersToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;
  const usersToFollow = await db.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      Followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 3,
  });
  return usersToFollow;
}

export const getTrendingTopics = unstable_cache(
  async () => {
    const result = await db.$queryRaw<{ hashtag: string; count: bigint }[]>`
              SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
              FROM posts
              GROUP BY (hashtag)
              ORDER BY count DESC, hashtag ASC
              LIMIT 5
          `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);
