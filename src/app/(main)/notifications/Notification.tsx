import UserAvatar from "@/components/main/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, LucideIcon, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import React from "react";
type NotificationProps = {
  notification: NotificationData;
};
function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    {
      message: string;
      icon: JSX.Element;
      href: string;
    }
  > = {
    FOLLOW: {
      message: ` has started following you.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: ` commented on your post`,
      icon: <MessageCircle className="text-primary size-7 fill-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: ` liked your post`,
      icon: <Heart className="size-7 text-rose-500 fill-rose-500" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { href, icon, message } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl transition-colors hover:bg-card/70 bg-card p-5 shadow-sm",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default Notification;
