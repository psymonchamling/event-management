import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
    },
    reviewerId: {
      type: String,
      required: true,
    },
    reviewerName: {
      type: String,
      required: true,
      default: "N/A",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
      maxLength: [200, "Comment should be under 200 characters."],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ eventId: 1, createdAt: -1 });

const Review = mongoose.model("review", reviewSchema);

export default Review;
