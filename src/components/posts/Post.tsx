import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../main/UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "../providers/SessionProvider";
import PostActions from "./PostActions";
import Linkify from "../Linkify";
import UserTooltip from "../users/UserTooltip";

type PostProps = {
  post: PostData;
};
export default function Post({ post }: PostProps) {
  const {user} =useSession()
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
      <div className="flex flex-wrap gap-3">
        <UserTooltip user={post.user}>
        <Link href={`/users/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user.avatarUrl} size={40}/>
        </Link>
        </UserTooltip>
        <div className="">
          <UserTooltip user={post.user}>
          <Link
            href={`/users/${post.user.username}`}
            className="block font-medium hover:underline"
          >
            {post.user.displayName}
          </Link>
          </UserTooltip>
          <Link href={`/posts/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
          {formatRelativeDate(post.createdAt)}</Link>
        </div>
      </div>
      {post.userId == user.id && <PostActions post={post} className=""/>}
      </div>
      <Linkify>
      <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
    </article>
  );
}
