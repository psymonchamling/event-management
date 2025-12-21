import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export async function migrateRegistrations() {
  try {
    // Get all registrations without price
    const registrations = await Registration.find({
      price: { $exists: false },
    });

    console.log(`Found ${registrations.length} registrations to update`);

    // Process each registration
    for (const registration of registrations) {
      try {
        // Find the event for this registration
        const event = await Event.findById(registration.eventId);

        if (event && event.price !== undefined) {
          // Update the registration with the event's price
          registration.price = event.price;
          await registration.save();
          console.log(
            `Updated registration ${registration._id} with price: ${event.price}`
          );
        } else {
          console.warn(
            `Event ${registration.eventId} not found or has no price for registration ${registration._id}`
          );
        }
      } catch (error) {
        console.error(
          `Error processing registration ${registration._id}:`,
          error.message
        );
      }
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}
