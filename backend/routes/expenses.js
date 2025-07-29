const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expensesController");

// /api/groups/:groupId/expenses
router.post("/", addExpense);

// /api/groups/:groupId/expenses/:expenseId
router.put("/:expenseId", updateExpense);
router.delete("/:expenseId", deleteExpense);

module.exports = router;
