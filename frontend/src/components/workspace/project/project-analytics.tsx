import { useParams } from "react-router";
import AnalyticsCard from "../common/analytics-card";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getProjectAnalyticsQueryFn } from "@/lib/api";

const ProjectAnalytics = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["project-analytics", workspaceId, projectId],
    queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
    staleTime: 0,
    enabled: !!projectId,
  });

  const analytics = data?.analytics;

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        title={"Total task"}
        value={analytics?.totalTasks || 0}
        isLoading={isPending}
      />
      <AnalyticsCard
        title={"Overdue task"}
        value={analytics?.overdueTasks || 0}
        isLoading={isPending}
      />
      <AnalyticsCard
        title={"Completed task"}
        value={analytics?.completedTasks || 0}
        isLoading={isPending}
      />
    </div>
  );
};

export default ProjectAnalytics;
