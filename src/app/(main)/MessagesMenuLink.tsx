"use client";
import { buttonVariants } from "@/components/ui/button";
import api from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";

type MessagesMenuLinkProps = {
  initialState: MessageCountInfo;
};

function MessagesMenuLink({ initialState }: MessagesMenuLinkProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      api.get("/api/messages/unread-count").json<MessageCountInfo>(),
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
      href="/messages"
    >
      {" "}
      <div className="relative">
        <Mail />
        {!!data && data.unreadCount > 0 && (
          <span className="absolute shrink-0 size-4 -right-1 -top-1 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-medium tabular-nums">
            {data.unreadCount}
          </span>
        )}
      </div>
      <span className="hidden lg:inline">Messages</span>
    </Link>
  );
}

export default MessagesMenuLink;
