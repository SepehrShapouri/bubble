import {
  useMutation,
  useQueryClient,
  QueryKey,
  InfiniteData,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { submitComment } from "./actions";
import { CommentPage } from "@/lib/types";

export function useSubmitComment(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
      toast({ description: "Added comment" });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          "There was a problem while adding this comment, care to try again?",
      });
    },
  });
  return { mutate, isPending };
}
