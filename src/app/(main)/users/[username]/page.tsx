import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import TrendsSidebar from "@/components/main/TrendsSidebar";
import UserAvatar from "@/components/main/UserAvatar";
import { Button } from "@/components/ui/button";
import FollowerCount from "@/components/users/FollowerCount";
import { db } from "@/lib/db";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import Linkify from "@/components/Linkify";
import EditProfileButton from "./EditProfileButton";

type PageProps = {
  params: { username: string };
};

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await db.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
}
async function page({ params }: PageProps) {
  const { username } = params;

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-center text-destructive">
        You are not authorized to view this page
      </p>
    );
  }
  const user = await getUser(username, loggedInUser.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>

      <TrendsSidebar />
    </main>
  );
}

export default page;

type UserProfileProps = {
  user: UserData;
  loggedInUserId: string;
};
async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.Followers,
    isFollowedByUser: user.Followers.some(
      ({ followerId }) => followerId == loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 lg:space-y-0 lg:gap-6 rounded-2xl bg-card p-5 shadow-sm lg:flex lg:items-start ">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto lg:mx-0 size-full lg:size-32 max-h-60 max-w-60 rounded-full"
      />
      <div className=" flex flex-col gap-5 w-full">
        <div className="flex gap-4 justify-between w-full">
          <div className="">
            <h1 className="text-3xl font-bold lg:text-2xl">
              {user.displayName}
            </h1>
            <div className="text-muted-foreground lg:text-sm">
              @{user.username}
            </div>
          </div>
          {user.id === loggedInUserId ? (
            <EditProfileButton user={user} />
          ) : (
            <FollowButton userId={user.id} initialState={followerInfo} />
          )}
        </div>
        {user.bio && (
          <>
            <Linkify>
              <div className="whitespace-pre-line overflow-hidden break-words">
                {user.bio}
              </div>
            </Linkify>
          </>
        )}
        <div className="text-xs text-muted-foreground">
          Member since {formatDate(user.createdAt, "MMM d, yyyy")}
        </div>
        <div className="flex items-center gap-3 w-full justify-between">
          <span className="flex items-center flex-col">
            <span className="font-semibold text-sm">
              {formatNumber(user._count.posts)}
            </span>
            <p className="text-muted-foreground">posts</p>
          </span>
          <FollowerCount userId={user.id} initialState={followerInfo} />
          <span className="flex items-center flex-col">
            <span className="font-semibold text-sm">
              {formatNumber(user._count.Following)}
            </span>
            <p className="text-muted-foreground">following</p>
          </span>
        </div>
      </div>
    </div>
  );
}
