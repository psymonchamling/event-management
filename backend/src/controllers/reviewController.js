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
    const newReview = await Review.create({
      eventId,
      reviewerId: reviewerId,
      reviewerName: reviewer?.name || "N/A",
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
  const { page = "1", limit = "4" } = req.query;

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

  try {
    const [totalReiview, reviews] = await Promise.all([
      Review.find({ eventId }).countDocuments(),
      Review.find({ eventId })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageSize),
    ]);

    const totalPages = Math.ceil(totalReiview / pageSize) || 1;

    return res.status(200).json({
      reviews,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: totalReiview,
        totalPages,
        hasPrevPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot get the reviews" });
  }
};
