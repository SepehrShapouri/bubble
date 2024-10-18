"use client";

import api from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./users/UserTooltip";
import { HTTPError } from "ky";

type UserLinkWithTooltipProps = PropsWithChildren & {
  username: string;
};

function UserLinkWithTooltip({ username, children }: UserLinkWithTooltipProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      api.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-sky-600 hover:underline"
      >
        {children}
      </Link>
    );
  }
  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-sky-600 hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}

export default UserLinkWithTooltip;
