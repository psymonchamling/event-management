import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section id="about" className="w-full py-20 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 items-center text-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              Ready to Host Your Next Event?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of event organizers using EventHub to create,
              promote, and manage successful events worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="px-8">
              Create Event Free
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Free forever plan available • Cancel
            anytime
          </p>
        </div>
      </div>
    </section>
  );
}
