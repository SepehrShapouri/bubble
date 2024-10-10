"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserFollowInfo } from "./UserFollowInfo";
type FollowerCountProps = {
  userId: string;
  initialState: FollowerInfo;
  user:UserData
};
function FollowerCount({ initialState, userId ,user}: FollowerCountProps) {
  const { data, isLoading } = useFollowerInfo(userId, initialState);
  const [followersOpen, setFollowersOpen] = useState<boolean>(false);
  return (
    <>
      <span
        className="flex items-center flex-col cursor-pointer"
        onClick={() => setFollowersOpen(true)}
      >
        <span className="font-semibold text-sm">
          {formatNumber(data.followers)}
        </span>
        <p className="text-muted-foreground">followers</p>
      </span>
      <UserFollowInfo open={followersOpen} setOpen={setFollowersOpen} userId={userId} initialState={initialState} user={user}/>
    </>
  );
}

export default FollowerCount;
