"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
type FollowerCountProps = {
  userId: string;
  initialState: FollowerInfo;
};
function FollowerCount({ initialState, userId }: FollowerCountProps) {
  const { data, isLoading } = useFollowerInfo(userId, initialState);
  return (
    <>
      <span className="flex items-center flex-col cursor-pointer">
        <span className="font-semibold text-sm">
          {formatNumber(data.followers)}
        </span>
        <p className="text-muted-foreground">followers</p>
      </span>
    </>
  );
}

export default FollowerCount;
