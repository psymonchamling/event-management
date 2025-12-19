import { createFileRoute, Link } from "@tanstack/react-router";

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");
import {
  Calendar,
  Ticket,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import authAxios from "@/services/authAxios";
import { useAuth } from "@/context/auth-context/auth-context";

export const Route = createFileRoute("/dashboard/my-registration")({
  component: RegistrationPage,
});

function generateQuery(userId: string) {
  const url: string = `/api/registration/events/${userId}`;
  return url;
}

function RegistrationPage() {
  /* const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"All" | RegistrationStatus>("All"); */

  const { userData } = useAuth();

  const userId: string = userData?.user?._id || "";

  /* const filtered = React.useMemo(() => {
    return MOCK_REGISTRATIONS.filter((reg) => {
      const matchesSearch =
        !search ||
        reg.title.toLowerCase().includes(search.toLowerCase()) ||
        reg.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || reg.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]); */

  const { data: registrationList } = useQuery({
    queryFn: () => authAxios(generateQuery(userId)).then((data) => data?.data),
    queryKey: ["registrationList", userId],
    enabled: Boolean(userId),
  });

  console.log({ registrationList });

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
              // value={query.q}
              // onChange={(e) =>
              //   dispatchQuery({
              //     type: ACTIONS.SET_QUERY,
              //     payload: e.target.value,
              //   })
              // }
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="w-full bg-transparent text-sm outline-none"
              // value={query.type}
              // onChange={(e) =>
              //   dispatchQuery({
              //     type: ACTIONS.SET_TYPE,
              //     payload: e.target.value,
              //   })
              // }
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

        {registrationList?.length === 0 ? (
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
            {registrationList?.map((event) => {
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

              const statusVariant =
                event.status === "confirmed"
                  ? "default"
                  : event.status === "pending"
                  ? "outline"
                  : "destructive";

              const statusIcon =
                event.status === "confirmed" ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : event.status === "Pending" ? (
                  <Ticket className="mr-1 h-3 w-3" />
                ) : (
                  <XCircle className="mr-1 h-3 w-3" />
                );

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
                            event?.eventId?.bannerUrl?.startsWith("/uploads/")
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
                            {event?.eventId?.title}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event?.eventId?.location}
                          </p>
                        </div>
                        <Badge
                          variant={statusVariant}
                          className="flex items-center"
                        >
                          {statusIcon}
                          <span className="text-xs">{event.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                        <div className="flex items-center gap-2 ">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {dateLabel} · {timeLabel}
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>{event?.eventId?.capacity}</span>
                      </div> */}
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
                      {/* <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <Link
                          to="/events/$eventId"
                          params={{ eventId: event?.eventId?._id }}
                        >
                          View Event
                        </Link>
                      </Button> */}
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
      </section>
    </div>
  );
}
