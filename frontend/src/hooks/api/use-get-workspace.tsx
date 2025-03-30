import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { CustomError } from "@/types/custom-error.type";
import { useQuery } from "@tanstack/react-query";

export default function useGetWorkspaceQuery(workspaceId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useQuery<any, CustomError>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0,
    retry: 2,
    enabled: !!workspaceId, // Only fetch data when workspaceId is provided. Otherwise, return stale data.
  });

  return query;
}
