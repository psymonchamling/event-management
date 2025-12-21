import { Router } from "express";
import {
  addReviewToEvent,
  getReviewsByEvent,
} from "../controllers/reviewController.js";

// /api/review
const reviewRouter = Router();

reviewRouter.post("/", addReviewToEvent);
reviewRouter.get("/:eventId", getReviewsByEvent);

export default reviewRouter;
