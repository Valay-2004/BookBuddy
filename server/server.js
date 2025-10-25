const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");
const bookRoutes = require("./src/routes/book.routes");
const reviewRoutes = require("./src/routes/review.routes");
const userRoutes = require("./src/routes/user.routes");
const adminRoutes = require("./src/routes/admin.routes");

const app = express();
app.use(cors());
app.use(express.json());
// for bookRoutes
app.use("/api/books", bookRoutes);
// for authRoutes
app.use("/api/auth", authRoutes);
// for reviews routes
app.use("/api", reviewRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));
// for user profile routes
app.use("/api", userRoutes);
// for admin actions routes
app.use("/api", adminRoutes);
