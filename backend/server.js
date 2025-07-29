require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const groupRoutes = require("./routes/groups");
const expenseRoutes = require("./routes/expenses");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/groups", authMiddleware, groupRoutes);

// Expense routes nested under groups
app.use("/api/groups/:groupId/expenses", authMiddleware, expenseRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware (optional)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
