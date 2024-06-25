const Router = require("express");
const {
  register,
  login,
  searchUsers,
  getUser,
} = require("../controllers/user.controller");
const protectRoute = require("../middlewares/protectRoute.js");
const upload = require("../utils/multer.js");

const router = Router();

router.post("/register", upload.single("image"), register);

router.post("/login", login);

router.get("/search", protectRoute, searchUsers);

router.get("/", protectRoute, getUser);

module.exports = router;
