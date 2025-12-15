import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import React, { useEffect } from "react";

import authAxios from "@/services/authAxios";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/events/")({
  component: EventsIndexPage,
});

type PublicEvent = {
  _id: string;
  title: string;
  type: string;
  dateTime?: string;
  location?: string;
  bannerUrl?: string;
};

type PublicEventListResponse = {
  events: PublicEvent[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

function EventsIndexPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<
    "All" | "Conference" | "Workshop" | "Meetup" | "Seminar" | "Webinar"
  >("All");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(9);

  const { data, isLoading } = useQuery<PublicEventListResponse>({
    queryKey: ["publicEvents"],
    queryFn: () =>
      authAxios
        .get<PublicEventListResponse>("/api/events", {
          params: { time: "latest" },
        })
        .then((res) => res.data),
  });

  const filtered = React.useMemo(() => {
    const events = data?.events ?? [];
    return events.filter((ev) => {
      const matchesQuery =
        !query ||
        ev.title.toLowerCase().includes(query.toLowerCase()) ||
        (ev.location ?? "").toLowerCase().includes(query.toLowerCase());

      const matchesType =
        type === "All" ||
        (ev.type && ev.type.toLowerCase() === type.toLowerCase());

      const eventDate = ev.dateTime ? new Date(ev.dateTime) : undefined;
      const matchesDate =
        !fromDate || (eventDate && eventDate >= new Date(fromDate));

      return matchesQuery && matchesType && matchesDate;
    });
  }, [data, query, type, fromDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  React.useEffect(() => {
    setPage(1);
  }, [query, type, fromDate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              All Events
            </h1>
            <p className="text-muted-foreground">
              Browse and discover upcoming events
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            ← Back to home
          </a>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="w-full bg-transparent text-sm outline-none"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "All"
                    | "Conference"
                    | "Workshop"
                    | "Meetup"
                    | "Seminar"
                    | "Webinar"
                )
              }
            >
              <option value="All">All types</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Meetup">Meetup</option>
              <option value="Seminar">Seminar</option>
              <option value="Webinar">Webinar</option>
            </select>
          </div>
          {/* <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              className="w-full bg-transparent text-sm outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div> */}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-background overflow-hidden"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-4 flex flex-col gap-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((ev) => {
                const dateLabel = ev.dateTime
                  ? new Date(ev.dateTime).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Date not set";

                return (
                  <a
                    key={ev._id}
                    href={`/events/${ev._id}`}
                    aria-label={`View event ${ev.title}`}
                    className="rounded-xl border border-border bg-background overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer block"
                  >
                    <article>
                      <div className="h-40 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20 relative">
                        {ev.bannerUrl ? (
                          <img
                            src={
                              ev.bannerUrl.startsWith("/uploads/")
                                ? `${API_BASE_URL}${ev.bannerUrl}`
                                : ev.bannerUrl
                            }
                            alt={ev.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/no-image.svg";
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {ev.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                            {ev.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{ev.location ?? "Online / TBA"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{dateLabel}</span>
                        </div>
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filtered.length === 0 ? 0 : start + 1}-
                {Math.min(end, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const isActive = p === currentPage;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-8 w-8 rounded-md border text-sm ${
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default EventsIndexPage;
