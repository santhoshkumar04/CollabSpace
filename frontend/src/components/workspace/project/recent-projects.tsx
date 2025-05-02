import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import UseGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { Loader } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/utils/helper";
import { format } from "date-fns";
import { Link } from "react-router";

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = UseGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  const projects = data?.projects || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? <Loader className="animate-spin" /> : null}
      {projects.length == 0 && <div>No Project created</div>}
      <ul role="list" className="space-y-2">
        {projects.map((item) => {
          const name = item.createdBy.name;
          const initial = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              key={item._id}
              role="listitem"
              className="shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out "
            >
              <Link
                to={`/workspace/${workspaceId}/project/${item._id}`}
                className="grid gap-8 p-0"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl !leading-[1.4rem]">{item.emoji}</div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.createdAt ? format(item.createdAt, "PPP") : null}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-gray-500">Created by</span>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src={item.createdBy.profilePicture}
                        alt="Avatar"
                      />
                      <AvatarFallback className={avatarColor}>
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentProjects;
