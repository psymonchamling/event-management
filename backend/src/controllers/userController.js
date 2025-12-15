import User from "../models/User.js";
import Event from "../models/Event.js";

// Get details for the currently authenticated user (uses req.userId)
export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      // Return early to avoid continuing after sending a response
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};

// Update profile fields for the currently authenticated user
export const updateUserDetail = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "organization",
      "website",
      "location",
      "timezone",
    ];

    const update = {};

    allowedFields.forEach((field) => {
      if (typeof req.body[field] !== "undefined") {
        update[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// Delete the currently authenticated user and their events
export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    // Clean up events organized by this user
    await Event.deleteMany({ organizerId: userId });

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear auth cookie so the user is effectively logged out
    res.clearCookie("jwt", { httpOnly: true });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// Public: get a user's details by ID, without requiring authentication
export const getUserByIdPublic = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};
