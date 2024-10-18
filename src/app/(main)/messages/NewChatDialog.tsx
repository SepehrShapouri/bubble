'use client'
import UserAvatar from "@/components/main/UserAvatar";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";

type NewChatDialogProps = {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
};

function NewChatDialog({ onChatCreated, onOpenChange }: NewChatDialogProps) {
  const { client, setActiveChannel } = useChatContext();
  const [groupName, setGroupName] = useState<string>("");
  const { toast } = useToast();
  const { user: loggedInUser } = useSession();
  if (!loggedInUser) throw Error("Unauthenticated");

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput);

  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-users", debouncedSearchInput],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: "admin" },
          ...(debouncedSearchInput
            ? {
                $or: [
                  { name: { $autocomplete: debouncedSearchInput } },
                  { username: { $autocomplete: debouncedSearchInput } },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 },
        { limit: 15 },
      ),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser.id, ...selectedUsers.map((u) => u.id)],
        name: selectedUsers.length > 1 ? groupName : undefined,
      });
      await channel.create();

      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError: (error) => {
      console.error("error starting a new chat", error);
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again",
      });
    },
  });
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              placeholder="Search bubblies..."
              className="h-12 w-full pe-4 ps-14 focus:outline-none cursor-text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {!!selectedUsers.length && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => (
                <SelectedUserTag
                  user={user}
                  onRemove={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.id != user.id),
                    )
                  }
                />
              ))}
            </div>
          )}
          <hr />
          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.users.map((user) => (
                <SearchedUsesrResult
                  user={user}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((u) => u.id === user.id)
                        ? prev.filter((u) => u.id !== user.id)
                        : [...prev, user],
                    );
                  }}
                  selected={selectedUsers.some((item) => item.id == user.id)}
                  key={user.id}
                />
              ))}
            {isSuccess && !data.users.length && (
              <p className="my-3 text-center text-muted-foreground">
                No users found, try a different name.
              </p>
            )}
            {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
            {isError && (
              <p className="text-destructive my-3 text-center">
                An error occurred while loading users.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6  flex flex-col gap-2 md:flex-col !space-x-0">
          {selectedUsers.length >= 2 && (
            <div className="flex flex-col gap-2">
              <Label>Group name</Label>
              <Input
                placeholder="The bois, or....gyals?"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}
          <Button
            disabled={!selectedUsers.length || isPending}
            isLoading={isPending}
            loadingText="Starting chat"
            className="w-full"
            onClick={() => mutate()}
          >
            Start chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;

type SearchedUsesrResultProps = {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
};

function SearchedUsesrResult({
  onClick,
  selected,
  user,
}: SearchedUsesrResultProps) {
  return (
    <button
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} size={36} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-green-500" />}
    </button>
  );
}

type SelectedUserTagProps = {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
};

function SelectedUserTag({ onRemove, user }: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
    >
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="mx-2 size-5 text-muted-foreground hover:text-primary" />
    </button>
  );
}
