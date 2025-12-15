import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authAxios from "@/services/authAxios";

export const Route = createFileRoute("/dashboard/edit-event")({
  component: EditEventPage,
  validateSearch: (search: Record<string, unknown>) => ({
    eventId: typeof search.eventId === "string" ? search.eventId : "",
  }),
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

function EditEventPage() {
  const navigate = useNavigate();
  const { eventId } = Route.useSearch();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    title: "",
    type: "" as EventType | "",
    dateTime: "",
    venueType: "" as VenueType | "",
    location: "",
    price: "",
    capacity: "",
    bannerFile: null as File | null,
    description: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    async function fetchEvent() {
      try {
        const res = await authAxios.get(`/api/events/${eventId}`);
        const event = res.data;

        setForm((prev) => ({
          ...prev,
          title: event.title ?? "",
          type: (event.type as EventType) ?? "",
          dateTime: event.dateTime
            ? new Date(event.dateTime).toISOString().slice(0, 16)
            : "",
          venueType: (event.venueType as VenueType) ?? "",
          location: event.location ?? "",
          price:
            typeof event.price === "number" ? String(event.price) : prev.price,
          capacity:
            typeof event.capacity === "number"
              ? String(event.capacity)
              : prev.capacity,
          description: event.description ?? "",
          bannerFile: null,
        }));
      } catch (err) {
        console.error("Failed to load event for editing:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  const onChange =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, bannerFile: file }));
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
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventId) return;
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("dateTime", form.dateTime);
      formData.append("venueType", form.venueType);
      formData.append("location", form.location);
      formData.append("price", form.price);
      formData.append("capacity", form.capacity);
      formData.append("description", form.description);

      if (form.bannerFile) {
        formData.append("banner", form.bannerFile);
      }

      await authAxios.put(`/api/events/${eventId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate({ to: "/events/$eventId", params: { eventId } });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!eventId) {
    return (
      <div className="px-4 lg:px-6 py-6">
        <p className="text-sm text-red-500">
          Missing event ID. Please navigate from an existing event.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6 py-6">
        <p className="text-sm text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-foreground">
            Edit Event
          </h2>
          <p className="text-sm text-muted-foreground">
            Update your event details and keep attendees informed.
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
            form="edit-event-form"
            type="submit"
            disabled={isSubmitting}
            className="h-9"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </nav>
      </header>

      <form
        id="edit-event-form"
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
                </div>
                {errors.title && (
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
                  <p className="mt-1 text-xs text-red-500">
                    {errors.dateTime}
                  </p>
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
                  <p className="mt-1 text-xs text-red-500">
                    {errors.venueType}
                  </p>
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
                  <p className="mt-1 text-xs text-red-500">
                    {errors.location}
                  </p>
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
                  <p className="mt-1 text-xs text-red-500">
                    {errors.capacity}
                  </p>
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
                <Label htmlFor="banner">Banner Image</Label>
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={onBannerChange}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload a new image to replace the existing banner.
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

        {/* Organizer info is derived from logged-in user; no manual input needed */}
      </form>
    </div>
  );
}

export default EditEventPage;

