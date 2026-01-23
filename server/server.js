const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Routes
const authRoutes = require("./src/routes/auth.routes");
const bookRoutes = require("./src/routes/book.routes");
const reviewRoutes = require("./src/routes/review.routes");
const userRoutes = require("./src/routes/user.routes");
const adminRoutes = require("./src/routes/admin.routes");
const readingListRoutes = require("./src/routes/readingList.routes");

const app = express(); // Express

app.use(helmet()); // Security
app.use(morgan("dev")); // Logging

// CORS Configuration - Allow frontend URLs in production
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",
  "https://book-buddy-gold.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // cors with configuration
app.use(express.json());

app.use("/api/books", bookRoutes); // for bookRoutes
app.use("/api/auth", authRoutes); // for authRoutes
app.use("/api", reviewRoutes); // for reviews routes
app.use("/api/users", userRoutes); // for user profile routes
app.use("/api", adminRoutes); // for admin actions routes
app.use("/api/reading-lists", readingListRoutes); // for reading list routes

// Adding the centralized errorHandler
const errorHandler = require("./src/middleware/errorHandler");
app.use(errorHandler);

// Database Migration (Self-Healing)
const runMigrations = require("./src/utils/migrate");

// Port for server
const PORT = process.env.PORT || 5000;

// Run migrations then start server
runMigrations().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
