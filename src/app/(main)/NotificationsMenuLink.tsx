"use client";
import { buttonVariants } from "@/components/ui/button";
import { NotificationCountInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getUnreadNotifCount } from "./notifications/actions";
type NotificationsMenuLinkProps = {
  initialState: NotificationCountInfo;
};
function NotificationsMenuLink({ initialState }: NotificationsMenuLinkProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: getUnreadNotifCount,
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Link
      className={cn(
        buttonVariants({
          variant: "ghost",
          className: "flex items-center justify-start gap-3",
        }),
      )}
      href="/notifications"
    >
      {" "}
      <div className="relative">
        <Bell />
        {!!data.unreadCount && (
          <span className="absolute -right-1 -top-1 rounded-full bg-primary text-white px-1 text-[10px] font-medium tabular-nums">
            {data.unreadCount}
          </span>
        )}
      </div>
      <span className="hidden lg:inline">Notifications</span>
    </Link>
  );
}

export default NotificationsMenuLink;
