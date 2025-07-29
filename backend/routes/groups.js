const express = require("express");
const router = express.Router();
const {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
} = require("../controllers/groupsController");

// /api/groups
router.get("/", getGroups);
router.post("/", createGroup);
router.post("/:groupId/members", addMemberToGroup);

// /api/groups/:groupId
router.get("/:groupId", getGroupById);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

module.exports = router;
