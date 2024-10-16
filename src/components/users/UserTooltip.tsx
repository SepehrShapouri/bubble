"use client";
import { FollowerInfo, UserData } from "@/lib/types";
import { PropsWithChildren } from "react";

type UserTooltipProps = PropsWithChildren & {
  user: UserData;
};
import React from "react";
import { useSession } from "../providers/SessionProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import UserAvatar from "../main/UserAvatar";
import FollowButton from "../FollowButton";
import Linkify from "../Linkify";
import FollowerCount from "./FollowerCount";
import { formatNumber } from "@/lib/utils";
import useFollowerInfo from "@/hooks/useFollowerInfo";

function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();
  const followerInfo: FollowerInfo = {
    followers: user._count.Followers,
    isFollowedByUser: !!user.Followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id != user.id && (
                <FollowButton userId={user.id} initialState={followerInfo} />
              )}
            </div>
            <div className="">
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <div className="flex items-center justify-between">
              <FollowerCount userId={user.id} initialState={followerInfo} />
              <span className="flex items-center flex-col cursor-pointer">
                <span className="font-semibold text-sm">
                  {formatNumber(user._count.Following)}
                </span>
                <p className="text-muted-foreground">following</p>
              </span>
              <span className="flex items-center flex-col cursor-pointer">
                <span className="font-semibold text-sm">
                  {formatNumber(user._count.posts)}
                </span>
                <p className="text-muted-foreground">posts</p>
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default UserTooltip;
