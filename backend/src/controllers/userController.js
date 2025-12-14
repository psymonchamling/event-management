import User from "../models/User.js";

export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // is return necessary here? - Yes, it's needed to stop executing the rest of the code in the function after responding.
    }
    res.status(200).json({ user });

    return user;
  } catch (err) {
    res.status(400).json({ err });
  }
};
