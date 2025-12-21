import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import authRouter from "./routes/authRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import cookiePraser from "cookie-parser";
import cors from "cors";
import requireAuth from "../middleware/authMiddleware.js";
import { getUserByIdPublic } from "./controllers/userController.js";
import path from "path";
import registrationRouter from "./routes/registrationRoutes.js";
import userRouter from "./routes/userDetail.js";
import { migrateRegistrations } from "./service/migration.js";
import reviewRouter from "./routes/reviewRoutes.js";

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.resolve("uploads")));

// Public: get any user's details by ID (no auth required)
app.get("/api/users/:id", getUserByIdPublic);

app.use(authRouter);
app.use("/api/events", eventRouter);
app.use("/api/registration", requireAuth, registrationRouter);
app.use("/api/userdetail", requireAuth, userRouter);
app.use("/api/review", requireAuth, reviewRouter);

// 404 handler - must be after all routes
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

// Centralized error handler - must be last
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

async function startServerWithDatabase() {
  try {
    // Connect to database first
    await connectDB();

    //Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`); // Added ${PORT}
    });
    // migrateRegistrations();
  } catch (error) {}
}

startServerWithDatabase();
