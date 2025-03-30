import { getMemberInWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function useGetWorkspaceMembers(workspaceId: string) {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMemberInWorkspaceQueryFn(workspaceId),
    staleTime: Infinity,
  });
  return query;
}
