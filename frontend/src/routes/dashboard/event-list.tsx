import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Calendar, MapPin, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/dashboard/event-list")({
  component: EventListPage,
});

function EventListPage() {
  const titles = [
    "Tech Innovators Summit",
    "Design Systems Workshop",
    "Startup Pitch Night",
    "AI in Healthcare",
    "Web Dev Meetup",
    "Marketing Growth Hacks",
  ];
  const dates = [
    "2026-01-14",
    "2026-01-20",
    "2026-01-28",
    "2026-02-02",
    "2026-02-11",
    "2026-02-20",
  ];
  const locations = [
    "San Francisco, CA",
    "Remote",
    "New York, NY",
    "Boston, MA",
    "Austin, TX",
    "Remote",
  ];
  const types = [
    "Conference",
    "Workshop",
    "Meetup",
    "Seminar",
    "Webinar",
    "Conference",
  ];

  const mockEvents = Array.from({ length: 12 }).map((_, i) => {
    const idx = i % 6;
    return {
      id: `${i + 1}`,
      title: titles[idx],
      dateISO: dates[idx],
      dateLabel: new Date(dates[idx]).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      location: locations[idx],
      type: types[idx],
    };
  });

  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<
    "All" | "Conference" | "Workshop" | "Meetup" | "Seminar" | "Webinar"
  >("All");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(9);

  const filtered = mockEvents.filter((ev) => {
    const matchesQuery =
      !query ||
      ev.title.toLowerCase().includes(query.toLowerCase()) ||
      ev.location.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === "All" || ev.type === type;
    const matchesDate = !fromDate || new Date(ev.dateISO) >= new Date(fromDate);
    return matchesQuery && matchesType && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  React.useEffect(() => {
    setPage(1);
  }, [query, type, fromDate]);

  return (
    <div className="px-4 lg:px-6">
      <section className="py-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">Events</h2>
            <p className="text-muted-foreground text-sm">
              Manage and review your events
            </p>
          </div>
          <a
            href="/dashboard/add-event"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Add Event
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
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              className="w-full bg-transparent text-sm outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((ev) => (
            <a
              key={ev.id}
              href={`/events/${ev.id}`}
              aria-label={`View event ${ev.title}`}
              className="rounded-xl border border-border bg-background overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer block"
            >
              <article>
                <div className="h-40 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20" />
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
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{ev.dateLabel}</span>
                  </div>
                </div>
              </article>
            </a>
          ))}
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
      </section>
    </div>
  );
}

export default EventListPage;
