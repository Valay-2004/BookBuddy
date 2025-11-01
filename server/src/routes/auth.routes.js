const express = require("express");
const { body } = require("express-validator");
const { signup, login } = require("../controllers/auth.controller");
const router = express.Router();

router.post(
  "/signup",
  [
    body("name").isLength()({ min: 3 }.trim().escape()),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
  ],
  signup
);
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  login
);

module.exports = router;
