import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FollowerInfo, UserData } from "@/lib/types";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { useSession } from "../providers/SessionProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserFollowers,
  removeFollower,
} from "@/app/(main)/users/[username]/actions";
import FollowButton from "../FollowButton";
import UserAvatar from "../main/UserAvatar";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

export function UserFollowInfo({
  open,
  setOpen,
  userId,
  initialState,
  user,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  initialState: FollowerInfo;
  user: UserData;
}) {
  console.log(user);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();
  const { user: loggedInUser } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: followers, isLoading } = useQuery({
    queryKey: ["user-followers"],
    queryFn: () => getUserFollowers(user.username),
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationKey: ["remove-follower"],
    mutationFn: removeFollower,
    onMutate: async (followerId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["user-followers"],
      });

      // Snapshot the previous value
      const previousFollowers = queryClient.getQueryData(["user-followers", ,]);

      // Optimistically update to the new value
      queryClient.setQueryData(["user-followers"], (old) =>
        old ? old.filter((follower) => follower.id !== followerId) : [],
      );

      // Return a context object with the snapshotted value
      return { previousFollowers };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["user-followers"], context?.previousFollowers);
      toast({
        variant: "destructive",
        description: "Failed to remove follower",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-followers"],
      });
    },
    onSuccess: () => {
      toast({ variant: "default", description: "Removed follower" });
      router.refresh();
    },
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <Skeletons />
          ) : (
            followers?.map((follower) => {
              return (
                <div
                  key={follower.id}
                  className="flex items-center justify-between gap-3"
                >
                  <Link
                    href={`/users/${follower.username}`}
                    className="flex items-center gap-3"
                  >
                    <UserAvatar
                      avatarUrl={follower.avatarUrl}
                      size={40}
                      className="flex-none"
                    />
                    <div>
                      <p className="line-clamp-1 break-all font-semibold hover:underline">
                        {follower.displayName}
                      </p>
                      <p className="line-clamp-1 break-all text-muted-foreground">
                        @{follower.username}
                      </p>
                    </div>
                  </Link>
                  {user.id == loggedInUser.id && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(follower.id)}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Skeletons() {
  return (
    <>
      {" "}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-[36px] w-[66px] animate-pulse rounded-md" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-[36px] w-[66px] animate-pulse rounded-md" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-[36px] w-[66px] animate-pulse rounded-md" />
      </div>
    </>
  );
}
