import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { getPostDataInclude, UserData } from "@/lib/types";
import { cache, Suspense } from "react";
import Post from "@/components/posts/Post";
import { notFound } from "next/navigation";
import UserTooltip from "@/components/users/UserTooltip";
import Link from "next/link";
import UserAvatar from "@/components/main/UserAvatar";
import { Loader2 } from "lucide-react";
import Linkify from "@/components/Linkify";
import FollowButton from "@/components/FollowButton";
type PageProps = {
  params: { postId: string };
};
const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();
  return post;
});

export async function generateMetadata({ params }: PageProps) {
  const { user } = await validateRequest();
  if (!user) return {};
  const post = await getPost(params.postId, user.id);
  return {
    title: `${post?.user.displayName} : ${post?.content.slice(0, 50)}...`,
  };
}
async function page({ params }: PageProps) {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <p className="text-destructive">You dont have access to this page</p>
    );
  }

  const post = await getPost(params.postId, user.id);
  return (
    <main className="w-full flex min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden lg:block h-fit w-80 flex-none">
        <Suspense
          fallback={<Loader2 className="animate-spin mx-auto size-8" />}
        >
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

export default page;

type UserInfoSidebarProps = {
  user: UserData;
};

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
    const { user: loggedInUser } = await validateRequest();
  
    if (!loggedInUser) return null;
  
    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm ">
        <div className="text-xl font-bold">About this user</div>
        <UserTooltip user={user}>
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none size-12" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        </UserTooltip>
        <Linkify>
          <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </div>
        </Linkify>
        {user.id !== loggedInUser.id && (
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.Followers,
              isFollowedByUser: user.Followers.some(
                ({ followerId }) => followerId === loggedInUser.id,
              ),
            }}
          />
        )}
      </div>
    );
  }