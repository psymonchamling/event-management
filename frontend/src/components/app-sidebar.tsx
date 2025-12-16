import * as React from "react";
import {
  IconCamera,
  IconClipboardList,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconListDetails,
  IconLogout,
  IconReport,
  IconSettings,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import useLogout from "@/hooks/useLogout.hook";
import { NavDocuments } from "./nav-documents";

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "My Events",
      url: "/dashboard/event-list",
      icon: IconListDetails,
    },
    {
      title: "My Registration",
      url: "/dashboard/registration",
      icon: IconClipboardList,
    },
    // {
    //   title: "Analytics",
    //   url: "/dashboard/analytics",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Projects",
    //   url: "/dashboard/projects",
    //   icon: IconFolder,
    // },
    // {
    //   title: "Team",
    //   url: "/dashboard/team",
    //   icon: IconUsers,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/setting",
      icon: IconSettings,
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useLogout();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={navData.navMain} />
        {/* <NavDocuments items={navData.documents} /> */}
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <button
          type="button"
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus:outline-none"
          onClick={() => logout()}
        >
          <IconLogout className="w-5 h-5 text-destructive" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
