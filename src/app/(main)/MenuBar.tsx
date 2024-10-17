import { validateRequest } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import NotificationsMenuLink from "./NotificationsMenuLink";
import { db } from "@/lib/db";
import MessagesMenuLink from "./MessagesMenuLink";
import streamServerClient from "@/lib/stream";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
    db.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  const { total_unread_count } = await streamServerClient.getUnreadCount(
    user.id,
  );
  return (
    <div className={className}>
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        title="Home"
        href="/"
      >
        {" "}
        <Home />
        <span className="hidden lg:inline">Home</span>
      </Link>
      <NotificationsMenuLink
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesMenuLink initialState={{ unreadCount: unreadMessageCount }} />
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        href="/bookmarks"
      >
        {" "}
        <Bookmark />
        <span className="hidden lg:inline">Bookmarks</span>
      </Link>
    </div>
  );
}
