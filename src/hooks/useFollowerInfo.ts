import { getFollowers } from "@/components/users/actions";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const { data, isLoading } = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: async () => await getFollowers(userId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return { data, isLoading };
}
