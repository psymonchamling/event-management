import Event from "../models/Event.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const addReviewToEvent = async (req, res) => {
  const { eventId, reviewerId, rating, review } = req.body;

  //check for user
  const reviewer = await User.findById(reviewerId);
  if (!reviewer) {
    return res.status(400).json({ message: "Reviewer not found!" });
  }

  //check for event
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(400).json({ message: "Event not found!" });
  }

  if (reviewerId === event.organizerId) {
    return res
      .status(400)
      .json({ message: "You cannot review on your own event." });
  }

  try {
    const newReview = Review.create({
      eventId,
      reviewerId: reviewerId,
      reviewerName: reviewerId?.name || "N/A",
      rating,
      review,
    });
    return res.status(201).json({ message: "Review added:", newReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Reivew cannot be saved." });
  }
};

export const getReviewsByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const reviews = await Review.find({ eventId });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot get the reviews" });
  }
};
