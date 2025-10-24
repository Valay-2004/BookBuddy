const { getUserProfile } = require("../models/user.model");

async function getProfile(req, res) {
  try {
    const userId = req.user.id; // JWT gives us this
    const user = await getUserProfile(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getProfile };
