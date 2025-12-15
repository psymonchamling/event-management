import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import authRouter from "./routes/authRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import cookiePraser from "cookie-parser";
import cors from "cors";
import reqireAuth from "../middleware/authMiddleware.js";
import { getUserDetail, getUserByIdPublic } from "./controllers/userController.js";
import path from "path";

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.resolve("uploads")));

//Routes
// Authenticated: current user's details (based on req.userId from auth middleware)
app.get("/api/userdetail", reqireAuth, getUserDetail);

// Public: get any user's details by ID (no auth required)
app.get("/api/users/:id", getUserByIdPublic);

app.use(authRouter);
app.use("/api/events", eventRouter);

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
  } catch (error) {}
}

startServerWithDatabase();
