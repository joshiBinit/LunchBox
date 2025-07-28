const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust path if different

// Route to create a new group
router.post("/create", authMiddleware, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Group name is required" });
  }

  try {
    // Create new group with the logged-in user as admin and initial member
    const group = new Group({
      name,
      admin: req.user._id,
      members: [req.user._id],
    });

    await group.save();

    // Also update user's group list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    res.status(201).json(group);
  } catch (err) {
    console.error("Error creating group:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to fetch all groups of the current user
router.get("/my-groups", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "groups",
      populate: {
        path: "admin members",
        select: "name email", // populate name and email of members/admin
      },
    });

    res.json(user.groups);
  } catch (err) {
    console.error("Error fetching user groups:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
