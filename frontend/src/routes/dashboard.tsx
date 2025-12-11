import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        className="top-16 h-[calc(100svh-4rem)] z-30"
      />
      <SidebarInset>
        {/* <SiteHeader /> */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardPage;
