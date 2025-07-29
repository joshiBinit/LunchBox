const mongoose = require("mongoose");

const ExpenseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  sharedBy: [{ type: String, required: true }],
});

const ExpenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    restaurant: { type: String, default: "" },
    payer: { type: String, required: true },
    items: [ExpenseItemSchema],
    totalCost: { type: Number, required: true },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
