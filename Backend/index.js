const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectMongoDB = require("./Database/connectDB");
const userModel = require("./Database/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jwt
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const { Ollama } = require("ollama");
const { console } = require("inspector");
const ollama = new Ollama();

dotenv.config();
connectMongoDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey12345!@";

// Root Route
app.get("/", (req, res) => {
  res.send("Hello, this is the Backend");
});

// Create Account Route
app.post("/createAccount", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    // Check if user already exists
    const userExists = await userModel.findOne({ emailAddress });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });

    console.log(newUser);
    res.status(201).send({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

// Login Route with JWT Token Generation
app.post("/loginUser", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ emailAddress });
    console.log(user);
    
    if (!user) {
      return res.status(401).send({ message: "User not found!" });
    }

    // Verify password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token validity
      }
    );

    res.status(200).send({
      message: "Logged in successfully!",
      token, // Send the token to the client
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send({ message: "An error occurred" });
  }
});

// Middleware to Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store decoded data in request object
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token!" });
  }
};

// Example of a Protected Route
app.get("/protectedRoute", verifyToken, (req, res) => {
  res.status(200).send({
    message: "Access granted to protected route!",
    user: req.user, // Return user data from token
  });
});

// Compliance Check Endpoint
app.post("/compliance", async (req, res) => {
  const { origin, destination, hscode, weight, type } = req.body;

  console.log(origin);
  console.log(destination);
  
  

  // Validate input fields
  if (!origin || !destination || !hscode || !weight || !type) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Send data to the get the compliance check
    const response = await axios.post("http://127.0.0.1:3000/predict", {
      origin,
      destination,
      hscode,
      weight,
      type,
    });

    const data = response.data;

    // Send response back to the frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Error connecting to the prediction API:", error.message);
    res.status(500).json({ error: "Failed to connect to the prediction service." });
  }
});

const PORT = process.env.PORT || 5000;
console.log("Preparing to start the server...");
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
