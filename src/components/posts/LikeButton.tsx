import { LikeInfo } from "@/lib/types";
import React from "react";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteLike, getPostLikes, likePost } from "./actions";
import { Heart } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
type LikeButtonProps = {
  postId: string;
  initialState: LikeInfo;
};
function LikeButton({ initialState, postId }: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];
  const { data: likes, isLoading: isLikesLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => getPostLikes(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      likes.isLikedByUser ? deleteLike(postId) : likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
    <button onClick={() => mutate()} className="flex items-center gap-1">
      <Heart
        className={cn(
          "size-5",
          likes.isLikedByUser && "fill-rose-500 text-rose-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {formatNumber(likes.likes)}
      </span>
    </button>
  );
}

export default LikeButton;