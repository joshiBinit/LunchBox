const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // use require, no .js extension

const allowedOrigins = [
  "http://localhost:5000", // Vite dev
  "https://lunch-box-frontend-vert.vercel.app", // Deployed frontend
];

// Use require for routes as well:
const groupRoutes = require("./routes/group");
const authRoutes = require("./routes/auth");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
