const express = require("express");
const { getProfile } = require("../controllers/user.controller");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticate, getProfile);

module.exports = router;
