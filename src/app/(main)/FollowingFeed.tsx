"use client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { getFollowingPosts, getPosts } from "@/components/main/actions";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

function FollowingFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PostsPage>({
    queryKey: ["post-feed", "following-feed"],
    queryFn: async ({ pageParam }) =>
      //@ts-ignore
      await getFollowingPosts(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const posts = data?.pages.flatMap((page) => page.posts) || [];
  if (status === "pending") {
    return <PostsLoadingSkeleton/>;
  }
  if(status === 'success' && !posts.length && !hasNextPage){
    return <p className="text-center text-muted-foreground">No posts found, start following people to see their posts</p>
  }
  if(status === "error"){
    return <p className="text-center text-destructive">An error occured while loading posts.</p>
  }
  return (
    <InfiniteScrollContainer className="space-y-5" onBottomReached={()=>hasNextPage && !isFetching && fetchNextPage()}>
      {posts?.map((post) => <Post post={post} key={post.id} />)}
      {isFetchingNextPage && <PostsLoadingSkeleton/>}
    </InfiniteScrollContainer>
  );
}

export default FollowingFeed;