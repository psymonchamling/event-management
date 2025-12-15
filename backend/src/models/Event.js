import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, "Event date & time are required"],
    },
    venueType: {
      type: String,
      enum: ["Online", "In-person"],
      required: [true, "Venue type is required"],
    },
    location: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    attending: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: function (v) {
          if (typeof this.capacity !== "number") {
            return true;
          }
          return v <= this.capacity;
        },
        message: "Attending cannot exceed capacity",
      },
    },
    bannerUrl: {
      // Local path or external URL
      type: String,
    },
    description: {
      type: String,
    },
    organizerName: {
      type: String,
      trim: true,
    },
    organizerEmail: {
      type: String,
      trim: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("event", eventSchema);

export default Event;
