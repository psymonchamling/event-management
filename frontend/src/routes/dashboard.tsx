import { createFileRoute } from "@tanstack/react-router";
import { Calendar, LayoutDashboard, Ticket, Users } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border p-5 flex items-center gap-4 bg-background">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xl font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

function DashboardPage1() {
  React.useEffect(() => {
    // naive auth gate
    const isAuthed = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthed) {
      window.location.href = "/";
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Dashboard</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <LayoutDashboard className="h-7 w-7 text-primary" />
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2">
            Quick overview of your events and registrations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={LayoutDashboard} label="Active Events" value="3" />
          <StatCard icon={Ticket} label="Registrations" value="128" />
          <StatCard icon={Users} label="Attendees" value="452" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-lg font-semibold mb-3">My Events</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage your events here. (Coming soon)
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-lg font-semibold mb-3">My Registrations</h2>
            <p className="text-sm text-muted-foreground">
              View tickets and upcoming events you&apos;re attending. (Coming
              soon)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// import data from "./data.json"

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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardPage;
