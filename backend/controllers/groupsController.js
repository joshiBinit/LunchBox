const Group = require("../models/Group");
const Expense = require("../models/Expense");
const User = require("../models/User");

// Get all groups
const getGroups = async (req, res) => {
  try {
    // Ideally filter by user - for now, return all groups
    const groups = await Group.find({});
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if user exists in User collection
    const userExists = await User.exists({ username: username.trim() });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(username.trim())) {
      return res
        .status(409)
        .json({ message: "Member already exists in group" });
    }

    group.members.push(username.trim());
    await group.save();

    // Retrieve the updated group with expenses populated
    const updatedGroup = await Group.findById(groupId).lean();
    const expenses = await Expense.find({ groupId }).lean();
    updatedGroup.expenses = expenses;

    res
      .status(200)
      .json({ message: "Member added successfully", group: updatedGroup });
  } catch (err) {
    console.error("Error adding member to group:", err);
    res.status(500).json({ message: "Failed to add member to group" });
  }
};

// Get group by ID with expenses populated
const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch group
    const group = await Group.findById(groupId).lean();
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Fetch expenses linked to group
    const expenses = await Expense.find({ groupId }).lean();

    group.expenses = expenses;

    res.json(group);
  } catch (error) {
    console.error("Failed to get group:", error);
    res.status(500).json({ message: "Failed to get group" });
  }
};

// Create new group
const createGroup = async (req, res) => {
  try {
    const { name, admin, members } = req.body;
    if (!name || !admin) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newGroup = new Group({ name, admin, members: members || [admin] });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Failed to create group" });
  }
};

// Update group (e.g. add members)
const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const updateFields = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (updateFields.name) group.name = updateFields.name;
    if (updateFields.admin) group.admin = updateFields.admin;
    if (updateFields.members) group.members = updateFields.members;

    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Failed to update group" });
  }
};

// Delete group (and all related expenses)
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    await Expense.deleteMany({ groupId });
    const result = await Group.findByIdAndDelete(groupId);
    if (!result) return res.status(404).json({ message: "Group not found" });
    res.json({ message: "Group and related expenses deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete group" });
  }
};

module.exports = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
};
