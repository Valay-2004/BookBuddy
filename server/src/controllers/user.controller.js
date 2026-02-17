const { getUserProfile } = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/users/me — get current user's profile with reviews
const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  res.json(user);
});

module.exports = { getProfile };
