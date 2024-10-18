"use client";
import { buttonVariants } from "@/components/ui/button";
import { NotificationCountInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getUnreadNotifCount } from "./notifications/actions";
import api from "@/lib/ky";
type NotificationsMenuLinkProps = {
  initialState: NotificationCountInfo;
};
function NotificationsMenuLink({ initialState }: NotificationsMenuLinkProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      api.get("/api/notifications/unread-count").json<NotificationCountInfo>(),
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
          <span className="absolute shrink-0 size-4 -right-1 -top-1 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-medium tabular-nums">
            {data.unreadCount}
          </span>
        )}
      </div>
      <span className="hidden lg:inline">Notifications</span>
    </Link>
  );
}

export default NotificationsMenuLink;
