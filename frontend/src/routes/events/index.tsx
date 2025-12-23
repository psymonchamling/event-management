import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useAllEvent from "./-hooks/useAllEvent.hook";

export const Route = createFileRoute("/events/")({
  component: EventsIndexPage,
});

function EventsIndexPage() {
  const {
    API_BASE_URL,
    ACTION,
    query,
    queryDispatch,
    isFetchingPublicEvent,
    eventList,
    currentPage,
    totalEvents,
    totalPages,
    start,
    end,
  } = useAllEvent();

  //for pagination
  const minimumNumberOfButton = 6;
  const numberOfButtonEachSide = 2;

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
              value={query.search}
              onChange={(e) =>
                queryDispatch({
                  type: ACTION.CHANGE_SEARCH,
                  payload: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="w-full bg-transparent text-sm outline-none"
              value={query.eventType}
              onChange={(e) =>
                queryDispatch({
                  type: ACTION.CHANGE_EVENTTYPE,
                  payload: e.target.value,
                })
              }
            >
              <option value="">All types</option>
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

        {isFetchingPublicEvent ? (
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
              {!!eventList?.length &&
                eventList.map((event) => {
                  const dateLabel = event?.dateTime
                    ? new Date(event.dateTime).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Date not set";

                  return (
                    <a
                      key={event?._id}
                      href={`/events/${event?._id}`}
                      aria-label={`View event ${event?.title || ""}`}
                      className="rounded-xl border border-border bg-background overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer block"
                    >
                      <article>
                        <div className="h-40 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20 relative">
                          {event?.bannerUrl ? (
                            <img
                              src={
                                event.bannerUrl.startsWith("/uploads/")
                                  ? `${API_BASE_URL}${event.bannerUrl}`
                                  : event?.bannerUrl
                              }
                              alt={event?.title}
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
                              {event?.title}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                              {event?.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event?.location ?? "Online / TBA"}</span>
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
                Showing {eventList?.length === 0 ? 0 : start + 1}-
                {Math.min(end, totalEvents)} of {totalEvents}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => queryDispatch({ type: ACTION.DECREASE_PAGE })}
                  disabled={currentPage === 1}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const isActive = p === currentPage;

                    if (
                      totalPages > minimumNumberOfButton &&
                      p > 2 &&
                      p <= totalPages - numberOfButtonEachSide
                    ) {
                      return "...";
                    }

                    return (
                      <button
                        key={p}
                        onClick={() =>
                          queryDispatch({
                            type: ACTION.CHANGE_PAGE,
                            payload: p.toString(),
                          })
                        }
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
                  onClick={() => queryDispatch({ type: ACTION.INCREASE_PAGE })}
                  disabled={currentPage >= totalPages}
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
