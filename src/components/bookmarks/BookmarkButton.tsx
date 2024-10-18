import { BookmarkInfo, LikeInfo } from "@/lib/types";
import React from "react";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Bookmark, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { addBookmark, deleteBookmark, getBookmark } from "./actions";
import api from "@/lib/ky";
type BookmarkButtonProps = {
  postId: string;
  initialState: BookmarkInfo;
};
function BookmarkButton({ initialState, postId }: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];
  const { data, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      api.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? api.delete(`/api/posts/${postId}/bookmark`)
        : api.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
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
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}

export default BookmarkButton;
