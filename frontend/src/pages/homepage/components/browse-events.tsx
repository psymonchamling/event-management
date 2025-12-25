import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import useQueryGetAllEvents from "@/hooks/useQueryGetAllEvents.hook";
import { Link } from "@tanstack/react-router";
import authAxios from "@/services/authAxios";

const API_BASE_URL = (authAxios.defaults.baseURL || "").replace(/\/+$/, "");

export default function BrowseEvents() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  useEffect(() => {
    if (!api) return;

    const id = window.setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => window.clearInterval(id);
  }, [api]);

  const finalParams = new URLSearchParams({
    page: "1",
    limit: "10",
  });

  const { data: publicEventData } = useQueryGetAllEvents({
    queryParams: finalParams.toString(),
  });

  const finalEventList = publicEventData?.events || [];

  if (finalEventList?.length < 4) {
    return null;
  }

  return (
    <section id="browse" className="w-full py-16 md:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Browse Events
            </h2>
            <p className="text-muted-foreground">
              Discover upcoming events curated for you
            </p>
          </div>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {!!finalEventList.length &&
                finalEventList.map((event) => (
                  <CarouselItem
                    key={event?._id}
                    className="basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Link
                      key={event?._id}
                      to="/events/$eventId"
                      params={{ eventId: event?._id }}
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
                    </Link>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="/events"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-6"
          >
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
