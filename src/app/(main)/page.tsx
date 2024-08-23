import PostEditor from "@/components/posts/editor/PostEditor";
import Image from "next/image";
import Post from "@/components/posts/Post";
import TrendsSidebar from "@/components/main/TrendsSidebar";
import { getPosts } from "@/components/main/actions";
import ForYouFeed from "./ForYouFeed";

export default  function Home() {
  return (
    <div className="w-full min-w-0  flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed/>
      </div>
      <TrendsSidebar/>
    </div>
  );
}
