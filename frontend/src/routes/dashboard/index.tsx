import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";

import authAxios from "@/services/authAxios";
import { SectionCards } from "@/components/section-cards";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <SectionCards />
      <RecentEvents />
    </div>
  );
}

export default DashboardOverviewPage;

type EventItem = {
  _id: string;
  title: string;
  type: string;
  dateTime?: string;
  location?: string;
  attending?: number;
  capacity?: number;
};

type EventListResponse = {
  events: EventItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function RecentEvents() {
  const { data, isLoading } = useQuery<EventListResponse>({
    queryKey: ["recentEvents"],
    queryFn: () =>
      authAxios
        .get<EventListResponse>("/api/events/mine", {
          params: { limit: 5, time: "latest" },
        })
        .then((res) => res.data),
  });

  const events = data?.events ?? [];

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Recent events
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              A quick overview of your latest events.
            </p>
          </div>
          {events.length > 0 && (
            <a
              href="/dashboard/event-list"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </a>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <ul className="divide-y divide-border">
            {events.map((ev) => {
              const dateLabel = ev.dateTime
                ? new Date(ev.dateTime).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Date not set";

              const countLabel =
                typeof ev.attending === "number" &&
                typeof ev.capacity === "number"
                  ? `${ev.attending}/${ev.capacity} going`
                  : undefined;

              return (
                <li
                  key={ev._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <a
                      href={`/events/${ev._id}`}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {ev.title}
                    </a>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {dateLabel}
                      </span>
                      {ev.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {ev.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                        {ev.type}
                      </span>
                      {countLabel && (
                        <span className="text-[11px]">{countLabel}</span>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/dashboard/edit-event?eventId=${ev._id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Edit
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            You haven&apos;t created any events yet.{" "}
            <a
              href="/dashboard/add-event"
              className="text-primary font-medium hover:underline"
            >
              Create your first event
            </a>
            .
          </div>
        )}
      </div>
    </div>
  );
}
