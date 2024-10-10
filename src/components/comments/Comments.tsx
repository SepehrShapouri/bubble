import { CommentPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostComments } from "./actions";
import { Comment } from "./Comment";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type CommentsProps = {
  post: PostData;
};

function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery<CommentPage>({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        getPostComments({ postId: post.id, cursor: pageParam as string }),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });
  const comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div className="space-y-3 ">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          onClick={() => fetchNextPage()}
          className="mx-auto block"
          disabled={isFetching}
        >
          Load previous comments
        </Button>
      )}
      {status == "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status == 'success' && !comments.length && (<p className="text-muted-foreground text-center">No comments yet.</p>)}
      {status == 'error'}
      <div className="divide-y ">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
}

export default Comments;
