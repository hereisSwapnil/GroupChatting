const Router = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller.js");
const protectRoute = require("../middlewares/protectRoute.js");

const router = Router();

router.post("/", protectRoute, sendMessage);
router.get("/:chatId", protectRoute, getMessages);

module.exports = router;
