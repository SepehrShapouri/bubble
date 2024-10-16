import { validateRequest } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import NotificationsMenuLink from "./NotificationsMenuLink";
import { db } from "@/lib/db";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationCount = await db.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });
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
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        href="/messages"
      >
        {" "}
        <Mail />
        <span className="hidden lg:inline">Messages</span>
      </Link>
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
