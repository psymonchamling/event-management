import { Router } from "express";
import {
  getAllEventRegisteredByUser,
  getAllRegistratedUserForEvent,
  isUserRegisteredForEvent,
  registerForEvent,
} from "../controllers/registrationController.js";
import requireAuth from "../../middleware/authMiddleware.js";

// /api/registration
const registrationRouter = Router();

registrationRouter.get("/status", requireAuth, isUserRegisteredForEvent);
registrationRouter.get(
  "/users/:eventId",
  requireAuth,
  getAllRegistratedUserForEvent
);
registrationRouter.get(
  "/events/:userId",
  requireAuth,
  getAllEventRegisteredByUser
);

registrationRouter.post("/", requireAuth, registerForEvent);

export default registrationRouter;
