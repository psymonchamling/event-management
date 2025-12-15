import User from "../models/User.js";

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
