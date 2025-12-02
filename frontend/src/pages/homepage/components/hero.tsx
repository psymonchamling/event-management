import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <div className="inline-block w-fit">
              <span className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Create & Manage Events
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Host Amazing Events
              <span className="text-primary"> Effortlessly</span>
            </h1>

            <p className="text-lg text-muted-foreground text-balance leading-relaxed max-w-lg">
              Create, promote, and manage events of any size. From webinars to
              conferences, EventHub provides all the tools you need to host
              successful events.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" className="gap-2">
                Create Your Event <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Explore Events
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">50,000+</p>
                <p className="text-xs text-muted-foreground">Events Hosted</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">2M+</p>
                <p className="text-xs text-muted-foreground">Attendees</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">155+</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Event Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
