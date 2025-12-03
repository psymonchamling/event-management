import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Users, Heart } from "lucide-react";

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
  const ev = getEventById(eventId);

  if (!ev) {
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

  const dateObj = new Date(ev.dateISO);
  const dateLabel = dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeLabel = dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const spacesAvailable = Math.max(ev.capacity - ev.attending, 0);
  const isAuthed =
    typeof window !== "undefined" &&
    localStorage.getItem("isAuthenticated") === "true";

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
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20" />
            </div>

            <div className="mt-6 flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <span className="w-fit text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  {ev.type}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {ev.title}
                </h1>
              </div>
              <button
                aria-label="Add to favorites"
                className="rounded-full border border-border p-2 hover:bg-secondary transition"
              >
                <Heart className="h-5 w-5" />
              </button>
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
                  <span className="text-sm">{ev.location}</span>
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
                {ev.description}
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Organized by
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {ev.organizer.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ev.organizer.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-border p-5 sticky top-24">
              <div className="text-2xl font-bold text-foreground">
                {ev.price > 0 ? `$${ev.price.toFixed(2)}` : "Free"}
              </div>
              <div className="mt-4 text-sm">
                <div className="text-muted-foreground">Spaces Available:</div>
                <div className="font-semibold">{spacesAvailable}</div>
              </div>
              <button
                disabled={!isAuthed}
                className="mt-4 inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10"
              >
                {isAuthed ? "Register Now" : "Login to register"}
              </button>
              {!isAuthed && (
                <p className="mt-2 text-[11px] text-muted-foreground text-center">
                  Login to register for this event
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default EventDetailPage;
