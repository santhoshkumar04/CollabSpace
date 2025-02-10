import { useParams } from "react-router";

export default function useWorkspaceId() {
  const params = useParams();
  return params.workspaceId as string;
}
