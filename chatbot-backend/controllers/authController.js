const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Signup endpoint
const signup = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation (optional)
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  console.log("Signup request - Email:", email, "Password:", password); // Debugging log

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create a new user
    const user = await User.create({ email, password });
    console.log("User created:", user); // Debugging log

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({ message: "User created successfully!", token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error while creating user." });
  }
};

// Login endpoint
const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation (optional)
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  console.log("Login request - Email:", email, "Password:", password); // Debugging log

  try {
    // Check if the user exists
    const user = await User.findOne({ email }).select("+password"); // Ensure password is included in query
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { signup, login };
