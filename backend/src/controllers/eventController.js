import Event from "../models/Event.js";

// Create a new event (protected)
export const createEvent = async (req, res) => {
  const {
    title,
    type,
    dateTime,
    venueType,
    location,
    price,
    capacity,
    description,
  } = req.body;

  try {
    const organizerId = req.userId;

    if (!organizerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const bannerUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const event = await Event.create({
      title,
      type,
      dateTime,
      venueType,
      location,
      price: price ? Number(price) : 0,
      capacity: capacity ? Number(capacity) : undefined,
      bannerUrl,
      description,
      organizerId,
    });

    res.status(201).json({ event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(400).json({
      message: "Failed to create event",
      error: err.message,
    });
  }
};

// Get all events (public), with optional filters & pagination
// Query params (all optional):
// - q: search by title (substring, case-insensitive)
// - type: filter by event type (exact match string)
// - time: "latest" | "oldest" (sort by dateTime)
// - page: page number (1-based, default 1)
// - limit: page size (default 10)
export const getAllEvents = async (req, res) => {
  try {
    const { q, type, time, page = "1", limit = "10" } = req.query;

    const filter = {};

    if (q && typeof q === "string" && q.trim()) {
      filter.title = { $regex: q.trim(), $options: "i" };
    }

    if (type && typeof type === "string" && type.trim()) {
      filter.type = type.trim();
    }

    // default: latest first
    let sort = { dateTime: -1 };
    if (time === "oldest") {
      sort = { dateTime: 1 };
    }

    const pageNumber = Math.max(
      parseInt(typeof page === "string" ? page : String(page || "1"), 10) || 1,
      1
    );
    const pageSize = Math.max(
      parseInt(typeof limit === "string" ? limit : String(limit || "10"), 10) ||
        10,
      1
    );
    const skip = (pageNumber - 1) * pageSize;

    const [events, total] = await Promise.all([
      Event.find(filter).sort(sort).skip(skip).limit(pageSize),
      Event.countDocuments(filter),
    ]);

    res.status(200).json({
      events,
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({
      message: "Failed to fetch events",
      error: err.message,
    });
  }
};

// Get all events created by the current logged-in user, with optional filters & pagination
// Query params (all optional except auth):
// - q: search by title (substring, case-insensitive)
// - type: filter by event type (exact match string)
// - time: "latest" | "oldest" (sort by dateTime)
// - page: page number (1-based, default 1)
// - limit: page size (default 10)
export const getMyEvents = async (req, res) => {
  try {
    const organizerId = req.userId;

    if (!organizerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { q, type, time, page = "1", limit = "10" } = req.query;

    const filter = { organizerId };

    if (q && typeof q === "string" && q.trim()) {
      filter.title = { $regex: q.trim(), $options: "i" };
    }

    if (type && typeof type === "string" && type.trim()) {
      filter.type = type.trim();
    }

    // default: latest first
    let sort = { dateTime: -1 };
    if (time === "oldest") {
      sort = { dateTime: 1 };
    }

    const pageNumber = Math.max(
      parseInt(typeof page === "string" ? page : String(page || "1"), 10) || 1,
      1
    );
    const pageSize = Math.max(
      parseInt(typeof limit === "string" ? limit : String(limit || "10"), 10) ||
        10,
      1
    );
    const skip = (pageNumber - 1) * pageSize;

    const [events, total] = await Promise.all([
      Event.find(filter).sort(sort).skip(skip).limit(pageSize),
      Event.countDocuments(filter),
    ]);

    res.status(200).json({
      events,
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("Error fetching user events:", err);
    res.status(500).json({
      message: "Failed to fetch events",
      error: err.message,
    });
  }
};

// Get a single event by its id (public)
export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event by id:", err);
    res.status(400).json({
      message: "Failed to fetch event",
      error: err.message,
    });
  }
};

// Update an existing event (protected, only by its organizer)
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    type,
    dateTime,
    venueType,
    location,
    price,
    capacity,
    description,
  } = req.body;

  try {
    const organizerId = req.userId;

    if (!organizerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Build a partial update object with only provided fields
    const update = {};

    if (typeof title !== "undefined") update.title = title;
    if (typeof type !== "undefined") update.type = type;
    if (typeof dateTime !== "undefined") update.dateTime = dateTime;
    if (typeof venueType !== "undefined") update.venueType = venueType;
    if (typeof location !== "undefined") update.location = location;
    if (typeof price !== "undefined") {
      update.price = Number(price);
    }
    if (typeof capacity !== "undefined") {
      update.capacity = Number(capacity);
    }
    if (typeof description !== "undefined") update.description = description;

    // If a new banner file is uploaded, update the bannerUrl
    if (req.file) {
      update.bannerUrl = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, organizerId },
      update,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    return res.status(400).json({
      message: "Failed to update event",
      error: err.message,
    });
  }
};

// Dashboard summary for the current organizer (protected)
export const getMyEventsSummary = async (req, res) => {
  try {
    const organizerId = req.userId;

    if (!organizerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const events = await Event.find({ organizerId });
    const now = new Date();

    const totalEvents = events.length;
    const upcomingEvents = events.filter(
      (ev) => ev.dateTime && ev.dateTime >= now
    ).length;
    const pastEvents = events.filter(
      (ev) => ev.dateTime && ev.dateTime < now
    ).length;

    const totalRegistrations = events.reduce(
      (sum, ev) => sum + (typeof ev.attending === "number" ? ev.attending : 0),
      0
    );

    const totalRevenue = events.reduce((sum, ev) => {
      const attending =
        typeof ev.attending === "number" ? ev.attending : 0;
      const price = typeof ev.price === "number" ? ev.price : 0;
      return sum + attending * price;
    }, 0);

    return res.status(200).json({
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalRegistrations,
      totalRevenue,
    });
  } catch (err) {
    console.error("Error fetching events summary:", err);
    return res.status(500).json({
      message: "Failed to fetch events summary",
      error: err.message,
    });
  }
};

