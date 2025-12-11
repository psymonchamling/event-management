import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/add-event")({
  component: AddEventPage,
});

type VenueType = "Online" | "In-person";
type EventType = "Conference" | "Workshop" | "Meetup" | "Seminar" | "Webinar";

const EVENT_TYPES: EventType[] = [
  "Conference",
  "Workshop",
  "Meetup",
  "Seminar",
  "Webinar",
];

function AddEventPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    type: "" as EventType | "",
    dateTime: "",
    venueType: "" as VenueType | "",
    location: "",
    price: "",
    capacity: "",
    bannerUrl: "",
    description: "",
    organizerName: "",
    organizerEmail: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const onChange =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  function validate() {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.type) next.type = "Category is required";
    if (!form.dateTime) next.dateTime = "Date & time are required";
    if (!form.venueType) next.venueType = "Venue type is required";
    if (form.venueType === "In-person" && !form.location.trim()) {
      next.location = "Location is required for in-person events";
    }
    if (form.price && Number(form.price) < 0)
      next.price = "Price cannot be negative";
    if (form.capacity && Number(form.capacity) < 0)
      next.capacity = "Capacity cannot be negative";
    if (form.organizerEmail && !/^\S+@\S+\.\S+$/.test(form.organizerEmail)) {
      next.organizerEmail = "Enter a valid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // TODO: Hook up to backend API
      await new Promise((r) => setTimeout(r, 700));
      navigate({ to: "/dashboard/event-list" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-foreground">Add Event</h2>
          <p className="text-sm text-muted-foreground">
            Provide clear details so attendees know what to expect.
          </p>
        </div>
        <nav className="flex items-center gap-2">
          <a
            href="/dashboard/event-list"
            className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </a>
          <Button
            form="add-event-form"
            type="submit"
            disabled={isSubmitting}
            className="h-9"
          >
            {isSubmitting ? "Saving..." : "Save Event"}
          </Button>
        </nav>
      </header>

        <form
        id="add-event-form"
        onSubmit={onSubmit}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 rounded-xl border border-border bg-background p-5">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Event details
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Title and category help people discover your event.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
              <Input
                id="title"
                  placeholder="e.g., Tech Innovators Summit"
                  value={form.title}
                  onChange={onChange("title")}
                  className={errors.title ? "border-red-500" : undefined}
                />
              </div>              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
              {!errors.title && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Keep it concise and descriptive.
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="type"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={onChange("type")}
                  aria-invalid={!!errors.type}
              >
                  <option value="">Select a category</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">{errors.type}</p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dateTime">
                  Date & Time <span className="text-red-500">*</span>
                </Label>
              <Input
                  id="dateTime"
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={onChange("dateTime")}
                  className={errors.dateTime ? "border-red-500" : undefined}
                />
              </div>
              {errors.dateTime && (
                <p className="mt-1 text-xs text-red-500">{errors.dateTime}</p>
              )}
              {!errors.dateTime && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Use your local timezone.
                </p>
              )}
            </div>
            </div>

            <div className="my-2 h-px bg-border" />

            <div>
              <h3 className="text-sm font-semibold text-foreground">Venue</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Specify how and where attendees will join.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="venueType">
                  Venue Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="venueType"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.venueType}
                  onChange={onChange("venueType")}
                  aria-invalid={!!errors.venueType}
                >
                  <option value="">Select venue type</option>
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>
              {errors.venueType && (
                <p className="mt-1 text-xs text-red-500">{errors.venueType}</p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                  placeholder="e.g., San Francisco, CA or Zoom"
                  value={form.location}
                  onChange={onChange("location")}
                  className={errors.location ? "border-red-500" : undefined}
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-xs text-red-500">{errors.location}</p>
              )}
              {!errors.location && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Required for in-person events. Use a city or full address.
                </p>
              )}
            </div>
            </div>

            <div className="my-2 h-px bg-border" />

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Ticketing
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Set price and capacity to control availability.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={onChange("price")}
                  className={errors.price ? "border-red-500" : undefined}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
              {!errors.price && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave 0 for a free event.
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                  min={0}
                  placeholder="e.g., 150"
                  value={form.capacity}
                  onChange={onChange("capacity")}
                  className={errors.capacity ? "border-red-500" : undefined}
                />
              </div>
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>
              )}
              {!errors.capacity && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Total seats or tickets available.
                </p>
              )}
            </div>
            </div>

            <div className="my-2 h-px bg-border" />

            <div>
              <h3 className="text-sm font-semibold text-foreground">Media</h3>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col gap-2">
              <Label htmlFor="bannerUrl">Banner Image URL</Label>
              <Input
                id="bannerUrl"
                placeholder="https://example.com/banner.jpg"
                  value={form.bannerUrl}
                  onChange={onChange("bannerUrl")}
              />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Recommended aspect ratio 16:9.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Description
              </h3>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                  rows={5}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Write a compelling description..."
                  value={form.description}
                  onChange={onChange("description")}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Include agenda, speakers, and who should attend.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5 h-fit">
          <h3 className="text-sm font-semibold text-foreground">Organizer</h3>
          <div className="mt-3 space-y-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="organizerName">Name</Label>
              <Input
                id="organizerName"
                placeholder="Jane Smith"
                value={form.organizerName}
                onChange={onChange("organizerName")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="organizerEmail">Email</Label>
              <Input
                id="organizerEmail"
                type="email"
                placeholder="jane@example.com"
                value={form.organizerEmail}
                onChange={onChange("organizerEmail")}
              />
              {errors.organizerEmail && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.organizerEmail}
                </p>
              )}
            </div>
          </div>
          <p className="mt-6 text-[11px] text-muted-foreground">
            Tip: Add a recognizable organizer name and contact email for trust.
          </p>
          </div>
        </form>
    </div>
  );
}

export default AddEventPage;


