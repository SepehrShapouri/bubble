import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MailPlus, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import NewChatDialog from "./NewChatDialog";
type ChatSidebarProps = {
  open: boolean;
  onClose: () => void;
};
function ChatSidebar({ onClose, open }: ChatSidebarProps) {
  const { user } = useSession();

  const CustomChannelPreview = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers), onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "md:flex size-full flex flex-col border-e md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: {
            $in: [user.id],
          },
        }}
        showChannelSearch
        options={{
          state: true,
          presence: true,
          limit: 8,
        }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={CustomChannelPreview}
      />
    </div>
  );
}

export default ChatSidebar;

type MenuHeaderProps = {
  onClose: () => void;
};

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState<boolean>(false);
  return (
    <>
      <div className="flex items-center p-2 gap-3">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start a new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false), onClose();
          }}
        />
      )}
    </>
  );
}
