import { getFollowers } from "@/components/users/actions";
import api from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const { data, isLoading } = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      api.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return { data, isLoading };
}
