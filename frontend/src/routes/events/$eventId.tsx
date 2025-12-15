import { useAuth } from "@/context/auth-context/auth-context";
import useGetUserById from "@/hooks/useGetUserById.hook";
import authAxios from "@/services/authAxios";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Heart, Star, ArrowLeft } from "lucide-react";

// Use the same base URL as our authenticated API client so /uploads paths
// resolve against the backend server, not the Vite dev server.
const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailPage,
});

const events = [
  {
    id: "1",
    title: "Tech Innovators Summit",
    dateISO: "2026-01-14T10:00:00Z",
    location: "San Francisco, CA",
    type: "Technology",
    price: 29.99,
    capacity: 100,
    attending: 45,
    organizer: { name: "Jane Smith", email: "jane@example.com" },
    description:
      "Learn modern web development with React and Next.js. Best practices, patterns, and live demos included.",
    imageAlt: "Team collaborating in workshop with presentation on screen",
  },
  {
    id: "2",
    title: "Design Systems Workshop",
    dateISO: "2026-01-20T10:00:00Z",
    location: "Remote",
    type: "Design",
    price: 0,
    capacity: 200,
    attending: 120,
    organizer: { name: "Alex Lee", email: "alex@example.com" },
    description:
      "Deep dive into scalable design systems with hands-on exercises and case studies.",
    imageAlt: "Designers discussing components and tokens at whiteboard",
  },
];

function getEventById(id: string) {
  return events.find((e) => e.id === id);
}

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const { userData } = useAuth();

  const ev = getEventById("1");

  // Example of how to fetch this event from the backend if needed:
  const { data: eventDetail, isFetching: isFetchingEventDetail } = useQuery({
    queryFn: async () => {
      const res = await authAxios(`/api/events/${eventId}`);
      return res.data;
    },
    queryKey: ["eventDetail", eventId],
    enabled: !!eventId,
  });

  const isCurrentUser: boolean =
    userData?.user?._id === eventDetail?.organizerId;

  const { user: eventOrganizer } = useGetUserById({
    id: eventDetail?.organizerId,
    enabled: !isCurrentUser,
  });

  //Loading page
  if (isFetchingEventDetail) {
    return <PageSkeletonLoader />;
  }

  //Event not found
  if (!eventDetail) {
    return <EventNotFound />;
  }

  const dateObj = new Date(eventDetail?.dateTime || "");
  const dateLabel = dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeLabel = dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isAuthed =
    typeof window !== "undefined" &&
    localStorage.getItem("isAuthenticated") === "true";

  const reviews = [
    {
      id: 1,
      name: "Sara P.",
      rating: 5,
      date: "Jan 2026",
      comment:
        "Fantastic event! The sessions were insightful and very well organized.",
    },
    {
      id: 2,
      name: "Michael R.",
      rating: 4,
      date: "Jan 2026",
      comment:
        "Great speakers and content. Could use a bit more Q&A time though.",
    },
    {
      id: 3,
      name: "Priya K.",
      rating: 5,
      date: "Dec 2025",
      comment:
        "Loved the networking opportunities. Learned a lot and met amazing people.",
    },
  ];

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <a
          href="/events"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          <span className="inline-flex h-8 items-center rounded-md border border-border px-3">
            Back to Events
          </span>
        </a>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border">
              {eventDetail?.bannerUrl ? (
                <img
                  src={
                    eventDetail.bannerUrl.startsWith("/uploads/")
                      ? `${API_BASE_URL}${eventDetail.bannerUrl}`
                      : eventDetail.bannerUrl
                  }
                  alt={eventDetail?.title || "Event banner"}
                  className="aspect-[16/9] w-full h-auto object-cover bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/no-image.svg";
                  }}
                />
              ) : (
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    No image available
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="w-fit text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  {eventDetail?.type}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {eventDetail?.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {isCurrentUser && (
                  <a
                    href={`/dashboard/edit-event?eventId=${eventId}`}
                    className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition"
                  >
                    Edit event
                  </a>
                )}
                <button
                  aria-label="Add to favorites"
                  className="rounded-full border border-border p-2 hover:bg-secondary transition"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Date & Time
                  </span>
                  <span className="text-sm">
                    {dateLabel} at {timeLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Location
                  </span>
                  <span className="text-sm">{eventDetail?.location || ""}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Attendees
                  </span>
                  <span className="text-sm">
                    {ev.attending}/{ev.capacity}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                About This Event
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {eventDetail?.description}
              </p>
            </div>
            <div className="mt-8 rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Organized by
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10" />
                <div className="flex flex-col">
                  {isCurrentUser ? (
                    <span className="text-m font-bold text-muted-foreground">
                      You
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-foreground">
                        {eventOrganizer?.name || "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {eventOrganizer?.email || "N/A"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 rounded-xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Customer Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(averageRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-lg border border-border p-4 bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground">
                        {rev.name}
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {rev.date}
                    </div>
                    <p className="mt-2 text-sm text-foreground leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar event */}
            {/* <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Similar Events
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {events
                  .filter((e) => e.id !== ev.id)
                  .slice(0, 3)
                  .map((e) => {
                    const d = new Date(e.dateISO).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" }
                    );
                    return (
                      <a
                        key={e.id}
                        href={`/events/${e.id}`}
                        className="rounded-xl border border-border bg-background overflow-hidden hover:shadow transition-shadow"
                      >
                        <div className="h-28 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20" />
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-foreground">
                              {e.title}
                            </div>
                            <span className="text-[11px] px-2 py-1 rounded bg-secondary text-secondary-foreground">
                              {e.type}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {e.location} • {d}
                          </div>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div> */}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-border p-5 sticky top-24">
              <div className="text-2xl font-bold text-foreground">
                {eventDetail?.price > 0
                  ? `$${eventDetail.price.toFixed(2)}`
                  : "Free"}
              </div>
              <div className="mt-4 text-sm">
                <div className="text-muted-foreground">Spaces Available:</div>
                <div className="font-semibold">{eventDetail?.capacity}</div>
              </div>
              {isAuthed ? (
                <button className="mt-4 inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10">
                  Register Now
                </button>
              ) : (
                <>
                  <a
                    href="/login"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10"
                  >
                    Login to Register
                  </a>
                  <p className="mt-2 text-[11px] text-muted-foreground text-center">
                    You must be logged in to register for this event
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default EventDetailPage;

function PageSkeletonLoader() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="h-60 w-full bg-muted rounded-xl" />
            <div className="flex flex-col gap-5">
              <div className="h-6 w-1/2 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded mt-2" />
              <div className="flex gap-3 items-center mt-3">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-28 bg-muted rounded" />
              </div>
              <div className="h-20 w-full bg-muted rounded mt-4" />
            </div>
            <div>
              <div className="h-5 w-40 bg-muted rounded mb-6" />
              <div className="space-y-4">
                <div className="h-12 w-full bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-border p-5 sticky top-24 flex flex-col gap-8">
              <div className="h-8 w-20 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded mx-auto" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

//Event not found
function EventNotFound() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="/events"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </a>
        <h1 className="text-2xl font-semibold mt-6">Event not found</h1>
      </section>
    </main>
  );
}
