import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import eventImage from "/public/event_image.jpg";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context/auth-context";
import { useLoginDailogContext } from "@/context/login-dialog-context/login-dialog-context";

export default function Hero() {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const { isLoginDialogOpen, setLoginDialogOpen } = useLoginDailogContext();

  console.log({ isLoggedIn, isLoginDialogOpen });
  function handleCreateEventButton() {
    if (isLoggedIn) {
      navigate({ to: "/dashboard/add-event" });
      return;
    }
    setLoginDialogOpen(true);
  }

  return (
    <section className="w-full py-10 md:py-15 lg:py-20">
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
              <Button
                size="lg"
                className="gap-2"
                onClick={handleCreateEventButton}
              >
                Create Your Event <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/events" })}
              >
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
            <div className="relative w-full max-w-md aspect-square border overflow-hidden rounded-2xl border">
              <img
                src={eventImage}
                alt="Event Dashboard Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
