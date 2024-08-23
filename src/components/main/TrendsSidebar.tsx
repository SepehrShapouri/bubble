import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../ui/button";
import { getTrendingTopics, getUsersToFollow } from "./actions";
import UserAvatar from "./UserAvatar";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<WhoToFollowSkeleton />}>
        <WhoToFollow />
      </Suspense>
      <Suspense>
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

export default TrendsSidebar;

async function WhoToFollow() {
  const usersToFollow = await getUsersToFollow();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow?.map((user) => {
        return (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar
                avatarUrl={user.avatarUrl}
                size={40}
                className="flex-none"
              />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
            <Button size="sm">Follow</Button>
          </div>
        );
      })}
    </div>
  );
}

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  console.log(trendingTopics);
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];
        console.log(title, "hs");
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function WhoToFollowSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        </div>
        <Skeleton className="w-[66px] h-[36px] animate-pulse rounded-md"/>
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        </div>
        <Skeleton className="w-[66px] h-[36px] animate-pulse rounded-md"/>
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        </div>
        <Skeleton className="w-[66px] h-[36px] animate-pulse rounded-md"/>
      </div>
    </div>
  );
}
