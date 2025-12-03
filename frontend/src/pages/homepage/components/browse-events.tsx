import { Calendar, MapPin } from "lucide-react";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  tag?: string;
};

const mockEvents: EventItem[] = [
  { id: "1", title: "Tech Innovators Summit", date: "Jan 14, 2026", location: "San Francisco, CA", tag: "Conference" },
  { id: "2", title: "Design Systems Workshop", date: "Jan 20, 2026", location: "Remote", tag: "Workshop" },
  { id: "3", title: "Startup Pitch Night", date: "Jan 28, 2026", location: "New York, NY" },
  { id: "4", title: "AI in Healthcare", date: "Feb 2, 2026", location: "Boston, MA", tag: "Seminar" },
  { id: "5", title: "Web Dev Meetup", date: "Feb 11, 2026", location: "Austin, TX" },
  { id: "6", title: "Marketing Growth Hacks", date: "Feb 20, 2026", location: "Remote", tag: "Webinar" },
];

export default function BrowseEvents() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  React.useEffect(() => {
    if (!api) return;
    const id = window.setInterval(() => {
      api.scrollNext();
    }, 3000);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <section id="browse" className="w-full py-16 md:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Browse Events</h2>
            <p className="text-muted-foreground">Discover upcoming events curated for you</p>
          </div>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {mockEvents.map((ev) => (
                <CarouselItem key={ev.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <a
                    href={`/events/${ev.id}`}
                    aria-label={`View event ${ev.title}`}
                    className="block rounded-xl border border-border bg-background overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                  >
                    <article>
                    <div className="h-36 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20" />
                    <div className="p-4 flex flex-col gap-3">
                      {ev.tag ? (
                        <span className="w-fit text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {ev.tag}
                        </span>
                      ) : null}
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">{ev.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                    </article>
                  </a>
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


