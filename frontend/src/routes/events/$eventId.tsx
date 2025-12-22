import { useAuth } from "@/context/auth-context/auth-context";
import useGetUserById from "@/hooks/useGetUserById.hook";
import DeleteEventButton from "@/pages/event-detail/components/delete-event-button";
import EventNotFound from "@/pages/event-detail/components/event-not-found";
import PageSkeletonLoader from "@/pages/event-detail/components/event-page-skeleton-loader";
import EventReviewSection from "@/pages/event-detail/components/event-review-section";
import RegisteredUsersList from "@/pages/event-detail/components/registered-user-list";
import RegistrationCard from "@/pages/event-detail/components/registration-card";
import useHandleRegistration from "@/pages/event-detail/hooks/useHandleRegistration.hook";
import authAxios from "@/services/authAxios";
import { decodeBase64ToJSON } from "@/utlis/helper";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { useEffect } from "react";

// Use the same base URL as our authenticated API client so /uploads paths
// resolve against the backend server, not the Vite dev server.
const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailPage,
});

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const { userData } = useAuth();
  const queryParams = Route.useSearch();

  const userId: string = userData?.user?._id || "";

  const { mutateRegistrationStatus } = useHandleRegistration({
    userId,
    eventId,
  });

  const { data: eventDetail, isFetching: isFetchingEventDetail } = useQuery({
    queryFn: async () => {
      const res = await authAxios(`/api/events/${eventId}`);
      return res.data;
    },
    queryKey: ["eventDetail", eventId],
    enabled: !!eventId,
  });

  useEffect(() => {
    if (
      queryParams &&
      "data" in queryParams &&
      queryParams.data &&
      !isFetchingEventDetail
    ) {
      const decodedResponse = decodeBase64ToJSON(queryParams.data as string);

      if (decodedResponse?.status === "COMPLETE" && mutateRegistrationStatus) {
        mutateRegistrationStatus();
      }
    }
  }, [queryParams, mutateRegistrationStatus, isFetchingEventDetail]);

  const isCurrentUser: boolean = userId === eventDetail?.organizerId;

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
                  <>
                    <a
                      href={`/dashboard/edit-event?eventId=${eventId}`}
                      className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition"
                    >
                      Edit event
                    </a>
                    <DeleteEventButton
                      eventId={eventId}
                      eventTitle={eventDetail.title}
                    />
                  </>
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
                    {/* {ev.attending}/{ev.capacity} */}
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
            {isCurrentUser && (
              <div className="mt-8 rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Registered Users
                  </h3>
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-medium">
                    Only visible to you
                  </span>
                </div>
                <RegisteredUsersList eventId={eventId} />
              </div>
            )}

            <EventReviewSection isCurrentUser={isCurrentUser} />

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

          <RegistrationCard
            userId={userId}
            eventId={eventId}
            eventPrice={eventDetail?.price || 0}
            eventCapacity={eventDetail?.capacity || 0}
            isCurrentUser={isCurrentUser}
          />
        </div>
      </section>
    </main>
  );
}

export default EventDetailPage;
