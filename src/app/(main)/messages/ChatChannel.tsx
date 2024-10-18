'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import React from "react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

type ChatChannelProps = {
  opened: boolean;
  openSidebar: () => void;
};
function ChatChannel({ openSidebar, opened }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

export default ChatChannel;

type CustomChannelHeaderProps = ChannelHeaderProps & {
  openSidebar: () => void;
};

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {

  return <div className="flex items-center gap-3">
    <div className="h-full p-2 md:hidden">
      <Button size="icon" variant="ghost" onClick={openSidebar}><Menu className="size-5"/></Button>
    </div>
    <ChannelHeader {...props}/>
  </div>
}
