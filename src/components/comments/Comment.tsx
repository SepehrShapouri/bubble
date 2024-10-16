import { CommentData } from "@/lib/types";
import UserTooltip from "../users/UserTooltip";
import Link from "next/link";
import UserAvatar from "../main/UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "../providers/SessionProvider";
import CommentActions from "./CommentActions";

type CommentProps = {
  comment: CommentData;
};

export function Comment({ comment }: CommentProps) {
  const { user } = useSession();
  return (
    <div className="flex gap-3 py-3 group/comment">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentActions
          comment={comment}
          className="ms-auto md:opacity-0 transition-all md:group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
