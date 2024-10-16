"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import {
  NotificationCountInfo,
  notificationsInclude,
  NotificationsPage,
} from "@/lib/types";

export async function getNotifications(cursor?: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthenticated");
  const pageSize = 10;
  const notifications = await db.notification.findMany({
    where: { recipientId: user.id },
    include: notificationsInclude,
    orderBy: { createdAt: "desc" },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor =
    notifications.length > pageSize ? notifications[pageSize].id : null;

  const data: NotificationsPage = {
    notifications: notifications.slice(0, pageSize),
    nextCursor,
  };

  return data;
}

export async function getUnreadNotifCount() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthenticated");

  const unreadCount = await db.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  const data: NotificationCountInfo = {
    unreadCount,
  };

  return data;
}

export async function markNotificationsAsRead() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthenticated");

  await db.notification.updateMany({
    where: {
      recipientId: user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });
  return {};
}
