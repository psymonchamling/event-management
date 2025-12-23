import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Filter, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import authAxios from "@/services/authAxios";
import { useAuth } from "@/context/auth-context/auth-context";
import { useEffect, useReducer, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

export const Route = createFileRoute("/dashboard/my-registration")({
  component: RegistrationPage,
});

export interface RegisteredEventData {
  events: Event[];
  pagination: Pagination;
}

export interface Event {
  _id: string;
  userId: string;
  eventId: EventId;
  status: string;
  paymentStatus: string;
  price: number;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EventId {
  _id: string;
  title: string;
  type: string;
  dateTime: string;
  location: string;
  price: number;
  capacity: number;
  attending: number;
  bannerUrl: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Initial state
const initialState = {
  search: "",
  type: "",
  time: "latest",
  page: 1,
  limit: 10,
};

// Action types
const ACTIONS = {
  SET_QUERY: "SET_QUERY",
  SET_TYPE: "SET_TYPE",
  SET_TIME: "SET_TIME",
  SET_PAGE: "SET_PAGE",
  SET_LIMIT: "SET_LIMIT",
  INCREASE_PAGE: "INCREASE_PAGE",
  DECREASE_PAGE: "DECREASE_PAGE",
  RESET: "RESET",
} as const;

type StateType = typeof initialState;

// Actions
type ActionType =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "INCREASE_PAGE" }
  | { type: "DECREASE_PAGE" }
  | { type: "SET_LIMIT"; payload: number };

// Reducer function
const queryReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case ACTIONS.SET_QUERY:
      return { ...state, search: action.payload };

    case ACTIONS.SET_TYPE:
      return { ...state, type: action.payload };

    case ACTIONS.SET_TIME:
      return { ...state, time: action.payload };

    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };

    case ACTIONS.INCREASE_PAGE:
      return { ...state, page: state.page + 1 };

    case ACTIONS.DECREASE_PAGE:
      return { ...state, page: state.page - 1 };

    case ACTIONS.SET_LIMIT:
      return { ...state, limit: action.payload };

    default:
      return state;
  }
};

function getParams({
  query,
  deferredSearch,
}: {
  query: StateType;
  deferredSearch: string;
}) {
  const finalParams = new URLSearchParams({
    time: "latest",
    page: query.page.toString(),
    limit: query.limit.toString(),
    ...(deferredSearch && { search: deferredSearch }),
    ...(query.type && { type: query.type }),
  });

  return finalParams.toString();
}

//for pagination
const minimumNumberOfButton = 6;
const numberOfButtonEachSide = 2;

function RegistrationPage() {
  const { userData } = useAuth();
  const userId: string = userData?.user?._id || "";

  const [query, dispatchQuery] = useReducer(
    queryReducer,
    initialState as StateType
  );
  const [deferredSearch, setdeferredSearch] = useState<string>(query.search);

  const {
    data: registeredEventData,
    isFetching: isFetchingregisteredEventData,
    refetch: refetchregisteredEventData,
  } = useQuery<RegisteredEventData>({
    queryFn: () =>
      authAxios(
        `/api/registration/events/${userId}?${getParams({
          query,
          deferredSearch,
        })}`
      ).then((data) => data?.data),
    queryKey: ["registeredEventList", userId],
    enabled: Boolean(userId),
  });

  const registeredEventList = registeredEventData?.events || [];
  const {
    page: currentPage = 1,
    limit: perPageLimit = 10,
    total: totalEvents = 0,
    totalPages = 1,
  } = registeredEventData?.pagination || {};

  const start = (currentPage - 1) * perPageLimit;
  const end = start + perPageLimit;

  useEffect(() => {
    refetchregisteredEventData();
  }, [
    refetchregisteredEventData,
    deferredSearch,
    query.time,
    query.limit,
    query.page,
    query.type,
  ]);

  useEffect(() => {
    const timerRef = setTimeout(() => {
      setdeferredSearch(query.search);
    }, 500);

    return () => clearTimeout(timerRef);
  }, [query.search]);

  return (
    <div className="px-4 lg:px-6">
      <section className="py-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">
              My Registrations
            </h2>
            <p className="text-muted-foreground text-sm">
              Review and manage all events you&apos;ve registered for.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search events..."
              value={query.search}
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

        {isFetchingregisteredEventData ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkelton />
          </div>
        ) : (
          <>
            {registeredEventList?.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  No registrations yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven&apos;t registered for any events. Explore all{" "}
                  <a
                    href="/events"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    upcoming events
                  </a>{" "}
                  to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {registeredEventList?.map((event) => {
                  const dateObj = new Date(event?.eventId?.dateTime);
                  const dateLabel = dateObj.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  const timeLabel = dateObj.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <Link
                      key={event._id}
                      to="/events/$eventId"
                      params={{ eventId: event.eventId?._id }}
                      className="rounded-xl border border-border bg-background overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer block"
                    >
                      <article
                        key={event?.eventId?._id}
                        // className="flex flex-col justify-between rounded-xl border border-border bg-background overflow-hidden shadow-sm"
                      >
                        <div className="h-40 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20 relative">
                          {event?.eventId?.bannerUrl ? (
                            <img
                              src={
                                event?.eventId?.bannerUrl?.startsWith(
                                  "/uploads/"
                                )
                                  ? `${API_BASE_URL}${event?.eventId?.bannerUrl}`
                                  : event?.eventId?.bannerUrl
                              }
                              alt={event?.eventId?.title}
                              className="absolute top-0 left-0 w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/no-image.svg";
                              }}
                            />
                          ) : null}
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-foreground">
                                {event?.eventId?.title || "N/A"}
                              </h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event?.eventId?.location || "N/A"}
                              </p>
                            </div>
                            {!!event?.eventId?.type && (
                              <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                                {event.eventId.type}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                            <div className="flex items-center gap-2 ">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {dateLabel} · {timeLabel}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Total Paid
                            </span>
                            <span className="font-semibold">
                              ${event?.eventId?.price?.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 p-2 flex flex-col gap-2 sm:flex-row sm:justify-end sm:items-center">
                          <div className="flex gap-2 w-full sm:w-auto">
                            {event?.status === "confirmed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled
                              >
                                Cancel (coming soon)
                              </Button>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {registeredEventList?.length === 0 ? 0 : start + 1}-
            {Math.min(end, totalEvents)} of {totalEvents}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatchQuery({ type: ACTIONS.DECREASE_PAGE })}
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
                      dispatchQuery({
                        type: ACTIONS.SET_PAGE,
                        payload: p,
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
              onClick={() => dispatchQuery({ type: ACTIONS.INCREASE_PAGE })}
              disabled={currentPage >= totalPages}
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

function CardSkelton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, idx) => (
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
      ))}
    </>
  );
}
