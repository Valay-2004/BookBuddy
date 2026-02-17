const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Route imports
const authRoutes = require("./src/routes/auth.routes");
const bookRoutes = require("./src/routes/book.routes");
const reviewRoutes = require("./src/routes/review.routes");
const userRoutes = require("./src/routes/user.routes");
const adminRoutes = require("./src/routes/admin.routes");
const readingListRoutes = require("./src/routes/readingList.routes");
const errorHandler = require("./src/middleware/errorHandler");
const runMigrations = require("./src/utils/migrate");

const app = express();

// --- Core Middleware ---
app.use(helmet());
app.use(compression());
app.use(express.json());

// Trust proxy on Render (required for express-rate-limit behind a reverse proxy)
app.set("trust proxy", 1);

// Logging: detailed in production, concise in dev
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS — allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://book-buddy-gold.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Increased for testing & search/sort heavy usage
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// --- Routes ---
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api", adminRoutes);
app.use("/api/reading-lists", readingListRoutes);

// Centralized error handler (must be after routes)
app.use(errorHandler);

// --- Start ---
const PORT = process.env.PORT || 5000;
runMigrations().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
