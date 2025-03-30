import * as React from "react";
import {
  CircleCheckBig,
  Frame,
  LayoutDashboard,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/asidebar/nav-main";
import { NavProjects } from "@/components/asidebar/nav-projects";
import { NavSecondary } from "@/components/asidebar/nav-secondary";
import { NavUser } from "@/components/asidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/auth-provider";
import SwitchWorkspace from "./switch-workspace";
import { Permissions } from "@/constant";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, hasPermission } = useAuthContext();

  const canManageSettings = hasPermission(
    Permissions.MANAGE_WORKSPACE_SETTINGS
  );

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/workspace/:workspaceId",
        icon: LayoutDashboard,
        isActive: false,
        // items: [
        //   {
        //     title: "History",
        //     url: "#",
        //   },
        //   {
        //     title: "Starred",
        //     url: "#",
        //   },
        //   {
        //     title: "Settings",
        //     url: "#",
        //   },
        // ],
      },
      {
        title: "Task",
        url: "/workspace/:workspaceId/tasks",
        icon: CircleCheckBig,
        // items: [
        //   {
        //     title: "Genesis",
        //     url: "#",
        //   },
        //   {
        //     title: "Explorer",
        //     url: "#",
        //   },
        //   {
        //     title: "Quantum",
        //     url: "#",
        //   },
        // ],
      },
      {
        title: "Member",
        url: "/workspace/:workspaceId/members",
        icon: UsersRound,
        // items: [
        //   {
        //     title: "Introduction",
        //     url: "#",
        //   },
        //   {
        //     title: "Get Started",
        //     url: "#",
        //   },
        //   {
        //     title: "Tutorials",
        //     url: "#",
        //   },
        //   {
        //     title: "Changelog",
        //     url: "#",
        //   },
        // ],
      },
      ...(canManageSettings
        ? [
            {
              title: "Settings",
              url: "/workspace/:workspaceId/settings",
              icon: Settings,
            },
          ]
        : []),
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SwitchWorkspace />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
