import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function useAuth() {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
  });
  return query;
}
