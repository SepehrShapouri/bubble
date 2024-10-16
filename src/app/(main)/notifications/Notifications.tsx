"use client";
import { getAllBookmarks } from "@/components/bookmarks/actions";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { NotificationsPage, PostsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getNotifications, markNotificationsAsRead } from "./actions";
import Notification from "./Notification";
import { useEffect } from "react";

function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<NotificationsPage>({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }) =>
      //@ts-ignore
      await getNotifications(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  useEffect(() => {
    mutate();
  }, [mutate]);
  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }
  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You dont have any notifications
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading notifications.
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications?.map((notification) => (
        <Notification notification={notification} key={notification.id} />
      ))}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScrollContainer>
  );
}

export default Notifications;
