// filepath: backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./model/User.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todoapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Signup Route
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user exists
        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: "Signup successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
app.post("/api/login", async (req, res) => {
    const { emailOrUsername, password } = req.body;
    try {
        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Optionally, create a JWT token
        const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1d" });

        res.json({ message: "Login successful", token, username: user.username, email: user.email });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(5174, () => console.log("Server running on port 5174"));