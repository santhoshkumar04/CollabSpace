import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAllTasksQueryFn } from "@/lib/api";
import { TaskType } from "@/types/api.type";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformStatusEnum,
} from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
      }),
  });

  // Tasks data
  const tasks: TaskType[] = data?.tasks || [];

  // Scalable component
  return (
    <div className="flex flex-col space-y-6">
      {isLoading ? (
        <Loader className="animate-spin h-8 w-8 place-self-center flex" />
      ) : null}
      <ul role="list" className="divide-y divide-gray-200">
        {tasks?.length === 0 && <div>No Task created yet</div>}
        {tasks.map((task) => {
          const name = task?.assignedTo?.name || "";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              key={task._id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              {/* Task Info */}
              <div className="flex flex-col space-y-1 flex-grow">
                <span className="text-sm text-gray-600 font-medium">
                  {task.taskCode}
                </span>
                <p className="text-md font-semibold text-gray-800 truncate">
                  {task.title}
                </p>
                <span className="text-sm text-gray-500">
                  Due: {task.dueDate}
                </span>
              </div>

              {/* Task Status */}
              <div className="text-sm font-medium ">
                <Badge
                  // variant={TaskStatusEnum[task.status]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.status)}</span>
                </Badge>
              </div>

              {/* Task Priority */}
              <div className="text-sm ml-2">
                <Badge
                  // variant={TaskPriorityEnum[task.priority]}
                  className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                >
                  <span>{transformStatusEnum(task.priority)}</span>
                </Badge>
              </div>

              {/* Assignee */}
              <div className="flex items-center space-x-2 ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task.assignedTo?.profilePicture || ""}
                    alt={task.assignedTo?.name}
                  />
                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentTasks;
