import mongoose, { mongo } from "mongoose";

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "waitlisted"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid",
  },
  notes: String,
}, { timestamps: true });

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model("registration", registrationSchema);

export default Registration;
