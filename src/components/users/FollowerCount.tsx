"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React from "react";
type FollowerCountProps = {
  userId: string;
  initialState: FollowerInfo;
};
function FollowerCount({ initialState, userId }: FollowerCountProps) {
  const { data, isLoading } = useFollowerInfo(userId, initialState);
  return <span>{formatNumber(data.followers)} Followers</span>;
}

export default FollowerCount;
