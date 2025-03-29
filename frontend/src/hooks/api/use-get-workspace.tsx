import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { CustomError } from "@/types/custom-error.type";
import { useQuery } from "@tanstack/react-query";

export default function useGetWorkspaceQuery(workspaceId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useQuery<any, CustomError>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
  });
  return query;
}
