const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL Connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "nor",
    database: "npm"
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database!");
});

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Signup Route
app.post("/api/signup", (req, res) => {
    const { email, password } = req.body;

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Failed to check email" });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const insertUserQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
        db.query(insertUserQuery, [email, password], (err, results) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Failed to create user" });
            }
            res.status(201).json({
                message: "User created successfully!",
                id: results.insertId,
                email: email
            });
        });
    });
});

// Login Route
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Failed to fetch user" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful!",
            id: results[0].id,
            email: results[0].email
        });
    });
});

// Fetch User by ID with Followers and Following Count
app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    const query = `
        SELECT 
            email,
            profile_pic,
            (SELECT COUNT(*) FROM followers WHERE user_id = ?) AS followers,
            (SELECT COUNT(*) FROM followers WHERE follower_id = ?) AS following
        FROM users 
        WHERE id = ?
    `;

    db.query(query, [userId, userId, userId], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Failed to fetch user" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(results[0]);
    });
});

// Update Profile Picture
app.post("/api/user/:id/profile-pic", upload.single("profile_pic"), (req, res) => {
    const userId = req.params.id;
    const profilePic = req.file ? `http://127.0.0.1:5000/uploads/${req.file.filename}` : null;

    if (!profilePic) {
        return res.status(400).json({ error: "No profile picture uploaded" });
    }

    // Fetch existing profile picture to delete it
    const getCurrentPicQuery = "SELECT profile_pic FROM users WHERE id = ?";
    db.query(getCurrentPicQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error getting current profile picture:", err);
            return res.status(500).json({ error: "Failed to get current profile picture" });
        }

        const currentPic = results[0].profile_pic;
        if (currentPic && currentPic !== "default-pic.png") {
            const currentPicPath = path.join(__dirname, "uploads", path.basename(currentPic));
            if (fs.existsSync(currentPicPath)) {
                fs.unlinkSync(currentPicPath);
            }
        }

        // Update the new profile picture in the database
        const query = "UPDATE users SET profile_pic = ? WHERE id = ?";
        db.query(query, [profilePic, userId], (err, results) => {
            if (err) {
                console.error("Error updating profile picture:", err);
                return res.status(500).json({ error: "Failed to update profile picture" });
            }

            res.status(200).json({
                message: "Profile picture updated successfully!",
                profile_pic: profilePic
            });
        });
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
