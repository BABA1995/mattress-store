const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const router = express.Router();
const authenticateUser = require("../middleware/auth");

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Authentication Middleware
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};

// Secured route example - Get user profile
router.get("/profile", protect, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

module.exports = router;
