import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/team")({
  component: DashboardTeamPage,
});

function DashboardTeamPage() {
  return (
    <div className="px-4 lg:px-6">
      <h2 className="text-xl font-semibold text-foreground">Team</h2>
      <p className="text-muted-foreground mt-2">
        Collaborators and roles. (Coming soon)
      </p>
      <div className="mt-4 rounded-xl border border-border p-5 bg-background">
        <div className="text-sm text-muted-foreground">
          Content placeholder for team.
        </div>
      </div>
    </div>
  );
}

export default DashboardTeamPage;

