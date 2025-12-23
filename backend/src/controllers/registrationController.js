import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";

//register for event
export const registerForEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  //check for user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  //check for event
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  //availability  check
  const registeredCount = await Registration.countDocuments({
    eventId,
    status: { $in: ["confirmed", "pending"] },
  });
  if (registeredCount >= event.capacity) {
    return res.status(400).json({ message: "Event is full." });
  }

  //check if user is already registered
  const isUserRegistered = await Registration.findOne({
    userId,
    eventId,
  });
  if (isUserRegistered) {
    return res
      .status(400)
      .json({ message: "User is already registered for event." });
  }

  //Create registration
  try {
    const newRegistration = Registration.create({
      userId,
      eventId,
      status: "pending",
      price: event?.price || 0,
    });
    return res.status(201).json({ newRegistration });
  } catch (err) {
    console.error("Error creating registration: ", err);
    res.status(400).json({
      message: "Fail to create registration",
      error: err.message,
    });
  }
};

// Get all users registered for an event
export const getAllRegistratedUserForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    //parse pagination parameters with default
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const totalRegistrationCount = await Registration.countDocuments({
      eventId,
    });

    const registrations = await Registration.find({ eventId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRegistrationCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      registrations,
      pagination: {
        currentPage: page,
        totalPages,
        totalRegistrationCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (err) {
    console.error("Error getting registration: ", err);
    res.status(400).json({
      message: "Fail to get regsitrations",
      error: err.message,
    });
  }
};

//Get all event registered by a user
export const getAllEventRegisteredByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    //parse pagination parameters with defaults
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const totalRegistrationCount = await Registration.countDocuments({
      userId,
    });

    const events = await Registration.find({ userId })
      .populate(
        "eventId",
        "title type dateTime location price capacity attending bannerUrl"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRegistrationCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalRegistrationCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (err) {
    console.error("Error getting registered event list: ", err);
    res.status(400).json({
      message: "Fail to get registered event",
      error: err.message,
    });
  }
};

//check if user is registered for event
export const isUserRegisteredForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.query;
    const isUserRegistered = await Registration.findOne({
      userId,
      eventId,
    });

    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    return res.status(200).json({ isRegistered: Boolean(isUserRegistered) });
  } catch (err) {
    console.error("Error getting registered event list: ", err);
    res.status(400).json({
      message: "Fail to get registered event",
      error: err.message,
    });
  }
};
