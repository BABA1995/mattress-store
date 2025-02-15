const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth"); // Import auth routes
const shopRoutes = require("./routes/shop"); // Import shop routes



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Add authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);


// Define PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
