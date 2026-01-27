import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Users, Target, Heart } from "lucide-react";

export const Route = createFileRoute("/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            About EventHub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make event management simple, accessible, and
            enjoyable for everyone. Whether you're hosting a small gathering or
            a large conference, EventHub is here to help.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              To empower event organizers with the tools they need to create
              memorable experiences and connect communities.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Easy Planning
              </h3>
              <p className="text-sm text-muted-foreground">
                Streamlined tools to make event planning effortless and
                efficient.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Community First
              </h3>
              <p className="text-sm text-muted-foreground">
                Building connections and bringing people together through
                events.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Goal Oriented
              </h3>
              <p className="text-sm text-muted-foreground">
                Focused on helping you achieve your event goals and objectives.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Passion Driven
              </h3>
              <p className="text-sm text-muted-foreground">
                We love what we do and it shows in every feature we build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              EventHub was born from a simple idea: event management shouldn't
              be complicated. We've experienced the frustration of juggling
              multiple tools, dealing with complex interfaces, and struggling to
              keep track of attendees.
            </p>
            <p>
              That's why we created EventHub - a platform that brings everything
              you need into one intuitive interface. From creating events to
              managing registrations and payments, we've built a solution that
              works for organizers of all experience levels.
            </p>
            <p>
              Today, EventHub serves thousands of event organizers worldwide,
              helping them create amazing experiences for their communities. And
              we're just getting started.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
