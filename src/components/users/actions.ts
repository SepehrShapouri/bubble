"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { FollowerInfo } from "@/lib/types";

export async function getFollowers(userId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) throw Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      Followers: {
        where: { followerId: loggedInUser.id },
        select: { followerId: true },
      },
      _count: { select: { Followers: true } },
    },
  });

  if (!user) throw Error("User not found");

  const data: FollowerInfo = {
    followers: user._count.Followers,
    isFollowedByUser: !!user.Followers.length,
  };

  return data;
}

export async function followUser(userId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthorized");

  await db.$transaction([
    db.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      },
      create: { followerId: loggedInUser.id, followingId: userId },
      update: {},
    }),
    db.notification.create({
      data: {
        issuerId: loggedInUser.id,
        recipientId: userId,
        type: "FOLLOW",
      },
    }),
  ]);
}

export async function unFollowUser(userId: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthorized");
  await db.$transaction([
    db.follow.deleteMany({
      where: { followerId: loggedInUser.id, followingId: userId },
    }),
    db.notification.deleteMany({
      where: {
        issuerId: loggedInUser.id,
        recipientId: userId,
        type: "FOLLOW",
      },
    }),
  ]);
  await db.follow.deleteMany({
    where: { followerId: loggedInUser.id, followingId: userId },
  });
}
