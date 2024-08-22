import PostEditor from "@/components/posts/editor/PostEditor";
import Image from "next/image";
import Post from "@/components/posts/Post";
import TrendsSidebar from "@/components/main/TrendsSidebar";
import { getPosts } from "@/components/main/actions";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
        <ForYouFeed/>
      </div>
      <TrendsSidebar/>
    </div>
  );
}
