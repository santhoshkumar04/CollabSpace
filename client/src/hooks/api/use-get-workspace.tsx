import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspaceQuery = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 1,
    retry: 2,
    enabled: !!workspaceId,
  });

  return query;
};

export default useGetWorkspaceQuery;
