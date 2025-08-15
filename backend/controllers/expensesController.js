const Expense = require("../models/Expense");
const Group = require("../models/Group");

// Add a new expense to a group
const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { date, restaurant = "", payer, items, totalCost } = req.body;

    // Validate required fields including non-empty items array
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

    // Validate payer is in group members
    if (!group.members.includes(payer)) {
      return res
        .status(400)
        .json({ message: "Payer is not a member of the group" });
    }

    // Validate each item's sharedBy are group members and item data is valid
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

// Update existing expense with allowance for empty items array
const updateExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const { date, restaurant, payer, items, totalCost } = req.body;

    // Find group for validation
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Find the expense
    const expense = await Expense.findOne({ _id: expenseId, groupId });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Validate payer if provided
    if (payer && !group.members.includes(payer)) {
      return res
        .status(400)
        .json({ message: "Payer is not a member of the group" });
    }

    // Validate items if provided
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }

      if (items.length > 0) {
        // Validate each item
        for (const item of items) {
          if (
            !item.name ||
            typeof item.cost !== "number" ||
            item.cost <= 0 ||
            !Array.isArray(item.sharedBy) ||
            item.sharedBy.length === 0
          ) {
            return res
              .status(400)
              .json({ message: "Invalid expense item data" });
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
      }
      // If items.length === 0, allow empty items array (delete all items)
    }

    // Update fields if provided
    if (date !== undefined) expense.date = date;
    if (restaurant !== undefined) expense.restaurant = restaurant;
    if (payer !== undefined) expense.payer = payer;
    if (items !== undefined) expense.items = items;
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
