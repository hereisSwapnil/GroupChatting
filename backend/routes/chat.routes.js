const Router = require("express");
const {
  getChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  searchChat,
  getGroupChat,
} = require("../controllers/chat.controller.js");
const protectRoute = require("../middlewares/protectRoute.js");

const router = Router();

router.post("/", protectRoute, getChat);
router.get("/", protectRoute, fetchChats);
router.post("/group", protectRoute, createGroupChat);
router.put("/group", protectRoute, renameGroup);
router.put("/group/add", protectRoute, addToGroup);
router.put("/group/remove", protectRoute, removeFromGroup);
router.get("/search", protectRoute, searchChat);
router.post("/group/get", protectRoute, getGroupChat);

module.exports = router;
