import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { Check, ChevronsUpDown, Loader, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useNavigate } from "react-router";
import { WorkspaceType } from "@/types/api.type";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import PermissionGuard from "../resuable/permission-guard";
import { Permissions } from "@/constant";

export default function SwitchWorkspace() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>();
  const { isMobile } = useSidebar();
  const { onOpen } = useCreateWorkspaceDialog();
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });

  const workspaces = data?.workspace;

  useEffect(() => {
    if (workspaces?.length) {
      const workspace = workspaceId
        ? workspaces.find((workspace) => workspace._id === workspaceId)
        : workspaces[0];

      if (workspace) {
        setActiveWorkspace(workspace);
        if (!workspaceId) navigate(`/workspace/${workspace._id}`);
      }
    }
  }, [workspaceId, workspaces, navigate]);

  const handleOnSwitchWorkspace = (workspace: WorkspaceType) => {
    setActiveWorkspace(workspace);
    navigate(`/workspace/${workspace._id}`);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {/* <activeWorkspace.logo className="size-4" /> */}
                  <p className="text-lg ">
                    {activeWorkspace?.name
                      .split(" ")?.[0]
                      ?.charAt(0)
                      .toLocaleUpperCase()}
                  </p>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeWorkspace?.name}
                  </span>
                  <span className="truncate text-xs">Free</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {isPending ? <Loader className=" w-5 h-5 animate-spin" /> : null}
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => handleOnSwitchWorkspace(workspace)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {/* <team.logo className="size-4 shrink-0" /> */}
                    {workspace?.name
                      ?.split(" ")?.[0]
                      .charAt(0)
                      .toLocaleUpperCase()}
                  </div>
                  {workspace.name}
                  {workspace._id === workspaceId && (
                    <DropdownMenuShortcut className="tracking-normal !opacity-100">
                      <Check className="w-4 h-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
              <PermissionGuard
                requiredPermission={Permissions.CREATE_WORKSPACE}
              >
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpen} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add team
                  </div>
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
