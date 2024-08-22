import PostEditor from "@/components/posts/editor/PostEditor";
import Image from "next/image";
import { getPosts } from "./actions";
import Post from "@/components/posts/Post";

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => {
          return <Post post={post} key={post.id} />;
        })}
      </div>
    </div>
  );
}
