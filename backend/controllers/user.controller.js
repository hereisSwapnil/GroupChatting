const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Chat = require("../models/chat.model");

const register = async (req, res) => {
  console.log(req.file);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePic = req.file?.path;
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });
    await newUser.save();
    if (newUser) {
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "21d",
      });
      res.cookie("token", token, { httpOnly: true, secure: true });

      res.status(201).json({
        _id: newUser._id,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(`Error during register user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {});
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({
      _id: user._id,
      token,
    });
  } catch (error) {
    console.error(`Error during login user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
};

const searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const safeQuery = escapeRegex(query);
    const users = await User.find({
      name: { $regex: new RegExp(safeQuery, "i") },
    }).select("name email profilePic");
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error during search user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error during get user: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, searchUsers, getUser };
