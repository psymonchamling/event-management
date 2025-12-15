import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Calendar, MapPin, Ticket, CheckCircle2, XCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/registration")({
  component: RegistrationPage,
});

type RegistrationStatus = "Confirmed" | "Pending" | "Cancelled";

type Registration = {
  id: string;
  eventId: string;
  title: string;
  dateTime: string;
  location: string;
  status: RegistrationStatus;
  ticketType: string;
  quantity: number;
  totalPaid: number;
};

// Static sample data for UI only. Will be replaced by real data later.
const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: "reg-1",
    eventId: "693efe39fc24e382413ddac3",
    title: "Tech Innovators Summit",
    dateTime: "2026-01-14T10:00:00.000Z",
    location: "San Francisco, CA",
    status: "Confirmed",
    ticketType: "Standard",
    quantity: 2,
    totalPaid: 199,
  },
  {
    id: "reg-2",
    eventId: "693eff00fc24e382413ddac4",
    title: "Design Systems Workshop",
    dateTime: "2026-01-20T16:30:00.000Z",
    location: "Online",
    status: "Pending",
    ticketType: "Early Bird",
    quantity: 1,
    totalPaid: 49,
  },
  {
    id: "reg-3",
    eventId: "693f0011fc24e382413ddac5",
    title: "Startup Pitch Night",
    dateTime: "2025-12-01T18:00:00.000Z",
    location: "New York, NY",
    status: "Cancelled",
    ticketType: "VIP",
    quantity: 1,
    totalPaid: 99,
  },
];

function RegistrationPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"All" | RegistrationStatus>("All");

  const filtered = React.useMemo(() => {
    return MOCK_REGISTRATIONS.filter((reg) => {
      const matchesSearch =
        !search ||
        reg.title.toLowerCase().includes(search.toLowerCase()) ||
        reg.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || reg.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="px-4 lg:px-6">
      <section className="py-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">
              My Registrations
            </h2>
            <p className="text-muted-foreground text-sm">
              Review and manage all events you&apos;ve registered for.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Label
              htmlFor="search"
              className="whitespace-nowrap text-xs text-muted-foreground"
            >
              Search
            </Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Event name or location"
              className="h-8 border-0 bg-transparent px-1 text-sm focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Label
              htmlFor="status"
              className="whitespace-nowrap text-xs text-muted-foreground"
            >
              Status
            </Label>
            <select
              id="status"
              className="w-full bg-transparent text-sm outline-none"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "All" | RegistrationStatus)
              }
            >
              <option value="All">All</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
            <h3 classary="text-lg font-semibold text-foreground">
              No registrations yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven&apos;t registered for any events. Explore all{" "}
              <a
                href="/events"
                className="text-primary hover:underline underline-offset-4"
              >
                upcoming events
              </a>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((reg) => {
              const dateObj = new Date(reg.dateTime);
              const dateLabel = dateObj.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const timeLabel = dateObj.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              });

              const statusVariant =
                reg.status === "Confirmed"
                  ? "default"
                  : reg.status === "Pending"
                  ? "outline"
                  : "destructive";

              const statusIcon =
                reg.status === "Confirmed" ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : reg.status === "Pending" ? (
                  <Ticket className="mr-1 h-3 w-3" />
                ) : (
                  <XCircle className="mr-1 h-3 w-3" />
                );

              return (
                <article
                  key={reg.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-foreground">
                          {reg.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {reg.location}
                        </p>
                      </div>
                      <Badge variant={statusVariant} className="flex items-center">
                        {statusIcon}
                        <span className="text-xs">{reg.status}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {dateLabel} · {timeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        <span>
                          {reg.quantity} x {reg.ticketType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Paid</span>
                      <span className="font-semibold">
                        ${reg.totalPaid.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <a href={`/events/${reg.eventId}`}>View Event</a>
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {reg.status === "Confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled
                        >
                          Cancel (coming soon)
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

