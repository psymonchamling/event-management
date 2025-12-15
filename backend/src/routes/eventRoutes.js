import { Router } from "express";
import { createEvent, getMyEvents } from "../controllers/eventController.js";
import reqireAuth from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/upload.js";

const eventRouter = Router();

// POST /api/events  - create new event
eventRouter.post("/", reqireAuth, upload.single("banner"), createEvent);

// GET /api/events/mine  - list events for current user with filters
// Query params: q, type, time=latest|oldest
eventRouter.get("/mine", reqireAuth, getMyEvents);

export default eventRouter;


