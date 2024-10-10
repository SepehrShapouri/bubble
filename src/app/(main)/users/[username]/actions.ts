"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  updateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: updateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });
  return updatedUser;
}

export async function getUserFollowers(username: string) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) throw Error("Unauthenticated");

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    include: {
      Followers: {
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
              _count: true,
              Followers: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const followers = user.Followers.map((follow) => follow.follower);

  return followers;
}

export async function removeFollower(followerId: string) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      throw new Error("Unauthenticated");
    }

    const userId = loggedInUser.id;

    // Check if the follow relationship exists
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: userId,
        },
      },
    });

    if (!existingFollow) {
      throw new Error("Follower relationship does not exist");
    }

    // Remove the follower
    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: userId,
        },
      },
    });

    return {};
  } catch (error) {
    console.error("Error removing follower:", error);
  }
}
