import { ArrowLeft } from "lucide-react";

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

export default EventNotFound;
