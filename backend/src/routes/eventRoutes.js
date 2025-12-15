import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  getMyEventsSummary,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import reqireAuth from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/upload.js";

const eventRouter = Router();

// GET /api/events - list all events (public, with optional filters)
eventRouter.get("/", getAllEvents);

// POST /api/events  - create new event (protected)
eventRouter.post("/", reqireAuth, upload.single("banner"), createEvent);

// GET /api/events/mine  - list events for current user with filters
// Query params: q, type, time=latest|oldest
eventRouter.get("/mine", reqireAuth, getMyEvents);

// GET /api/events/summary/mine - dashboard summary for current user
eventRouter.get("/summary/mine", reqireAuth, getMyEventsSummary);

// PUT /api/events/:id - update an existing event (only by its organizer)
eventRouter.put("/:id", reqireAuth, upload.single("banner"), updateEvent);

// DELETE /api/events/:id - delete an event (only by its organizer)
eventRouter.delete("/:id", reqireAuth, deleteEvent);

// GET /api/events/:id - get single event by id (public)
eventRouter.get("/:id", getEventById);

export default eventRouter;
