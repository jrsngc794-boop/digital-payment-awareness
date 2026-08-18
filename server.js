const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = "digital-payment-college-project-secret";

const USERS_FILE = path.join(__dirname, "users.json");

// Make sure users.json exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
}

// Read users
function getUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save users
function saveUsers(users) {
    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );
}

// Test backend
app.get("/", (req, res) => {
    res.json({
        message: "Digital Payment Awareness Backend is running!"
    });
});

// Register
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        if (password.length < 4) {
            return res.status(400).json({
                message: "Password must be at least 4 characters."
            });
        }

        const users = getUsers();

        const existingUser = users.find(
            user =>
                user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const usernameExists = users.find(
            user =>
                user.username.toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
            return res.status(409).json({
                message: "Username already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            username: username,
            email: email.toLowerCase(),
            password: hashedPassword
        };

        users.push(newUser);

        saveUsers(users);

        res.status(201).json({
            message: "Account created successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const users = getUsers();

        const user = users.find(
            user =>
                user.username.toLowerCase() === username.toLowerCase() &&
                user.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid username, email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username, email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login successful.",
            token,
            username: user.username
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Backend server running at http://localhost:${PORT}`
    );
});
