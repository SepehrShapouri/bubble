import { PostData, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deletePost } from "./actions";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { toast } = useToast();
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldDate) => {
          if (!oldDate) return;
          return {
            pageParams: oldDate.pageParams,
            pages: oldDate.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({ description: "Selected post has been deleted successfully." });
      if (pathname == `/posts/${deletedPost.id}`) {
        router.push(`/`);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "An error occurred while deleting the selected post, please try again.",
      });
    },
  });

  return { mutate, isDeleting };
}
