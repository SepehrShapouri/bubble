import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../ui/button";
import { getTrendingTopics, getUsersToFollow } from "./actions";
import UserAvatar from "./UserAvatar";
import { formatNumber } from "@/lib/utils";

function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <WhoToFollow />
      </Suspense>
      <Suspense fallback={<Loader2 className="animate-spin" />}>
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
            <Button>Follow</Button>
          </div>
        );
      })}
    </div>
  );
}

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
console.log(trendingTopics)
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];
        console.log(title,"hs")
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)}{" "}
              {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}