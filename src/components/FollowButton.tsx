"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import api from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

type FollowButtonProps = {
  userId: string;
  initialState: FollowerInfo;
};

function FollowButton({ userId, initialState }: FollowButtonProps) {
  const { data } = useFollowerInfo(userId, initialState);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate: changeFollowState, isPending } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? api.delete(`/api/users/${userId}/followers`)
        : api.post(`/api/users/${userId}/followers`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);

      console.error(error),
        toast({
          variant: "destructive",
          description: `Something went wrong, ${error.message}`,
        });
    },
  });
  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => changeFollowState()}
    >
      {data.isFollowedByUser ? "Following" : "Follow"}
    </Button>
  );
}

export default FollowButton;
