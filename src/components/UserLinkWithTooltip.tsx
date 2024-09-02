"use client";

import { getUser } from "@/app/(main)/users/actions";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useSession } from "./providers/SessionProvider";
import Link from "next/link";
import UserTooltip from "./users/UserTooltip";

type UserLinkWithTooltipProps = PropsWithChildren & {
  username: string;
};

function UserLinkWithTooltip({ username, children }: UserLinkWithTooltipProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["user-data", username],
    queryFn: async () => await getUser(username),
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
