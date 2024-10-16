"use client";
import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../main/UserAvatar";
import { cn, formatNumber, formatRelativeDate } from "@/lib/utils";
import { useSession } from "../providers/SessionProvider";
import PostActions from "./PostActions";
import Linkify from "../Linkify";
import UserTooltip from "../users/UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";
import LikeButton from "./LikeButton";
import BookmarkButton from "../bookmarks/BookmarkButton";
import { useState } from "react";
import { MessageCircle, MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";

type PostProps = {
  post: PostData;
};
export default function Post({ post }: PostProps) {
  const [showComments, setShowComments] = useState<boolean>(false);
  const { user } = useSession();
  
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} size={40} />
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
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.userId == user.id && <PostActions post={post} className="" />}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <div className="flex justify-between gap-5">
        <div className="flex items-cener gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.Like,
              isLikedByUser: !!post.Like.some((like) => like.userId == user.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        {post.userId != user.id && (
          <BookmarkButton
            postId={post.id}
            initialState={{
              isBookmarkedByUser: post.Bookmark.some(
                (bookmark) => bookmark.userId == user.id,
              ),
            }}
          />
        )}
      </div>

      {showComments && <Comments post={post} />}
    </article>
  );
}

type MediaPreviewsProps = {
  attachments: Media[];
};

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((media) => (
        <MediaPreview media={media} key={media.id} />
      ))}
    </div>
  );
}

type MediaPreviewProps = {
  media: Media;
};

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type == "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }
  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsuppoerted media type</p>;
}

type CommentButtonProps = {
  post: PostData;
  onClick: () => void;
};

function CommentButton({ onClick, post }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-1">
      <MessageCircle className="size-5 fill-muted-foreground text-muted-foreground" />
      <span className="text-sm font-medium tabular-nums">
        {formatNumber(post._count.Comment)}
      </span>
    </button>
  );
}
