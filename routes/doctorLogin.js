const express = require("express");
const router = express.Router();
const connection = require("../db"); // Import database connection
const jwt = require("jsonwebtoken"); // Make sure to install jsonwebtoken package

// Secret key for JWT - Store this in environment variables in a real application
const JWT_SECRET = "hii_there_2";

// User Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Query to find user by email and password (INSECURE - for temporary use only)
  const query = "SELECT * FROM doctors WHERE email = ? AND password = ?";

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Detailed Database Error:", err);
      return res.status(500).json({
        error: "Database error occurred",
        details: err.message,
        sqlMessage: err.sqlMessage,
        sqlState: err.sqlState,
      });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove sensitive information before sending response
    const { password: omit, ...userWithoutPassword } = user;

    // Respond with token and user info
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: userWithoutPassword,
    });
  });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized or token expired" });
  }
};

// Example protected route using the verification middleware
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

module.exports = router;
