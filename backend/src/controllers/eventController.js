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

