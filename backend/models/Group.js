const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: { type: String, required: true },
    members: [{ type: String, required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
