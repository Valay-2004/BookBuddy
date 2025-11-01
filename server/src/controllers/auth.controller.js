const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/auth.model");
const { validationResult } = require("express-validator");

// async function for signup
async function signup(req, res) {
  // validation for signup
  exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // send request to body with the given things
      const { name, email, password } = req.body;

      // now check if the user is already their
      const existing = await findUserByEmail(email);
      // if exists then return error
      if (existing)
        return res.status(400).json({ error: "Email already Exists" });
      // if not let move for the password

      // create password with bcrypt salt of 10
      const passwordHash = await bcrypt.hash(password, 10);
      // now after have the name, email and password which is not already
      // present in our db
      // we can create the new user
      const user = await createUser({ name, email, passwordHash });

      res.status(200).json(user);
    } catch (err) {
      // catch any error and show the message to the user
      res.status(500).json({ error: err.message });
    }
  };
}

async function login(req, res) {
  exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // same as sign up except we just need two things for login
      // 1. email (or username in this case is not included)
      // 2. password
      const { email, password } = req.body;
      const user = await findUserByEmail(email);

      // if the user email is not present in our db
      // return Error
      if (!user) return res.status(400).json({ error: "Invalid Credentials" });
      const valid = await bcrypt.compare(password, user.password_hash);
      // if the password is not correct or does not present in our db
      // return error
      if (!valid) return res.status(400).json({ error: "Invalid Credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        token,
        user: { id: user.id, role: user.role, name: user.name },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}

module.exports = { signup, login };
