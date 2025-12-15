import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import authAxios from "@/services/authAxios";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

export const Route = createFileRoute("/dashboard/event-list")({
  component: EventListPage,
});

type EventItemType = {
  _id: string;
  title: string;
  type: string;
  bannerUrl?: string;
  location?: string;
  dateTime?: string;
};

type EventListResponse = {
  events: EventItemType[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// Initial state
const initialState = {
  q: "",
  type: "",
  time: "",
  page: "",
  limit: "",
};

// Action types
const ACTIONS = {
  SET_QUERY: "SET_QUERY",
  SET_TYPE: "SET_TYPE",
  SET_TIME: "SET_TIME",
  SET_PAGE: "SET_PAGE",
  SET_LIMIT: "SET_LIMIT",
  RESET: "RESET",
} as const;

type StateType = typeof initialState;

// Actions
type ActionType =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_PAGE"; payload: string }
  | { type: "SET_LIMIT"; payload: string };

// Reducer function
const queryReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case ACTIONS.SET_QUERY:
      return { ...state, q: action.payload };

    case ACTIONS.SET_TYPE:
      return { ...state, type: action.payload };

    case ACTIONS.SET_TIME:
      return { ...state, time: action.payload };

    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };

    case ACTIONS.SET_LIMIT:
      return { ...state, limit: action.payload };

    default:
      return state;
  }
};

function generateQuery(query: StateType) {
  const url: string = "/api/events/mine";

  const entriesArray = Object.entries(query);
  const queryString: string = entriesArray.reduce((acc, arr) => {
    if (arr[1]) {
      return acc + `${arr[0]}=${arr[1]}`;
    }
    return acc;
  }, "");

  if (queryString) {
    return url + "?" + queryString;
  }

  return url;
}

function EventListPage() {
  const [query, dispatchQuery] = useReducer(
    queryReducer,
    initialState as StateType
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(query.q);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: eventList,
    refetch: refetchEventList,
    isLoading,
    isFetching,
  } = useQuery<EventListResponse>({
    queryFn: () => authAxios(generateQuery(query)).then((data) => data?.data),
    queryKey: ["eventList", "mine", query],
  });

  useEffect(() => {
    refetchEventList();
  }, [
    debouncedSearch,
    refetchEventList,
    query.time,
    query.limit,
    query.page,
    query.type,
  ]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(query.q);
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query.q]);

  // bannerUrl: "/uploads/1765735993898-636849902.jpg";
  // capacity: 197;
  // createdAt: "2025-12-14T18:13:13.920Z";
  // dateTime: "2025-12-09T20:12:00.000Z";
  // description: "this is a test";
  // location: "sdfsfd";
  // organizerEmail: "safdsaf@d.com";
  // organizerId: "693d291a0f4aaf02dd9454b2";
  // organizerName: "me";
  // price: 10;
  // title: "test";
  // type: "Workshop";
  // updatedAt: "2025-12-14T18:13:13.920Z";
  // venueType: "In-person";
  // __v: 0;
  // _id: "693efe39fc24e382413ddac3";

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
              value={query.q}
              onChange={(e) =>
                dispatchQuery({
                  type: ACTIONS.SET_QUERY,
                  payload: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="w-full bg-transparent text-sm outline-none"
              value={query.type}
              onChange={(e) =>
                dispatchQuery({
                  type: ACTIONS.SET_TYPE,
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
              // value={fromDate}
              // onChange={(e) => setFromDate(e.target.value)}
            />
          </div> */}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(isLoading || isFetching) && !eventList?.events?.length
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-background overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="h-40 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 relative">
                    <Skeleton className="absolute inset-0" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))
            : eventList?.events?.length
              ? eventList.events.map((event: EventItemType) => {
                  return (
                    <a
                      key={event._id}
                      // href={`/events/${event._id}`}
                      aria-label={`View event ${event?.title}`}
                      className="rounded-xl border border-border bg-background overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer block"
                    >
                      <article>
                        <div className="h-40 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20 relative">
                          {event.bannerUrl ? (
                            <img
                              src={
                                event.bannerUrl?.startsWith("/uploads/")
                                  ? `${API_BASE_URL}${event.bannerUrl}`
                                  : event.bannerUrl
                              }
                              alt={event.title}
                              className="absolute top-0 left-0 w-full h-full object-cover"
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
                              {event.title}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                              {event.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{event.dateTime}</span>
                          </div>
                        </div>
                      </article>
                    </a>
                  );
                })
              : (
                <p className="col-span-full text-center text-sm text-muted-foreground">
                  No events found.
                </p>
                )}
        </div>

        {/* Pagination */}
        {/* <div className="mt-6 flex items-center justify-between">
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
        </div> */}
      </section>
    </div>
  );
}

export default EventListPage;
