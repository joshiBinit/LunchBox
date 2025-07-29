const Expense = require("../models/Expense");
const Group = require("../models/Group");

// Add a new expense to a group
const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { date, restaurant = "", payer, items, totalCost } = req.body;

    // Validate required fields
    if (
      !date ||
      !payer ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing required expense fields" });
    }

    // Confirm group exists
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Optional: validate payer is in group members (recommended)
    if (!group.members.includes(payer)) {
      return res
        .status(400)
        .json({ message: "Payer is not a member of the group" });
    }

    // Optional: validate each item's sharedBy are group members
    for (const item of items) {
      if (
        !item.name ||
        typeof item.cost !== "number" ||
        item.cost <= 0 ||
        !Array.isArray(item.sharedBy) ||
        item.sharedBy.length === 0
      ) {
        return res.status(400).json({ message: "Invalid expense item data" });
      }
      const invalidSharer = item.sharedBy.find(
        (sharer) => !group.members.includes(sharer)
      );
      if (invalidSharer) {
        return res.status(400).json({
          message: `SharedBy member '${invalidSharer}' is not in group`,
        });
      }
    }

    // Create and save expense document
    const newExpense = new Expense({
      date,
      restaurant,
      payer,
      items,
      totalCost,
      groupId,
    });
    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Failed to add expense:", error);
    res
      .status(500)
      .json({ message: "Failed to add expense", error: error.message });
  }
};

// Update existing expense
const updateExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const { date, restaurant, payer, items, totalCost } = req.body;

    const expense = await Expense.findOne({ _id: expenseId, groupId });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (date) expense.date = date;
    if (restaurant !== undefined) expense.restaurant = restaurant;
    if (payer) expense.payer = payer;
    if (items) expense.items = items;
    if (totalCost !== undefined) expense.totalCost = totalCost;

    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error("Failed to update expense:", error);
    res
      .status(500)
      .json({ message: "Failed to update expense", error: error.message });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: expenseId, groupId });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Failed to delete expense:", error);
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: error.message });
  }
};

module.exports = {
  addExpense,
  updateExpense,
  deleteExpense,
};
