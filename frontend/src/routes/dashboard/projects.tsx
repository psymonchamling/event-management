import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects")({
  component: DashboardProjectsPage,
});

function DashboardProjectsPage() {
  return (
    <div className="px-4 lg:px-6">
      <h2 className="text-xl font-semibold text-foreground">Projects</h2>
      <p className="text-muted-foreground mt-2">
        Manage related projects. (Coming soon)
      </p>
      <div className="mt-4 rounded-xl border border-border p-5 bg-background">
        <div className="text-sm text-muted-foreground">
          Content placeholder for projects.
        </div>
      </div>
    </div>
  );
}

export default DashboardProjectsPage;

