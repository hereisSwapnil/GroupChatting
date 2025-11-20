const Chat = require("../models/chat.model");
const User = require("../models/user.model");

const getChat = async (req, res) => {
  const { userId } = req.body;
  console.log(userId, req.user._id.toString());
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }
    var chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    chat = await Chat.populate(chat, {
      path: "latestMessage.sender",
      select: "-password",
    });

    if (chat.length > 0) {
      res.status(200).json(chat[0]);
    } else {
      var chat_ = new Chat({
        chatName: "sender",
        isGroupChat: false,
        users: [userId, req.user._id],
      });
      await chat_.save();
      chat_ = await Chat.populate(chat_, {
        path: "users",
        select: "-password",
      });
      res.status(200).json(chat_);
    }
  } catch (error) {
    console.error(`Error during get chat: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getGroupChat = async (req, res) => {
  const { chatId } = req.body;
  try {
    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    }).populate("users", "-password");
    if (!chat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error(`Error during get group chat: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const populatedChats = await Chat.populate(chats, {
      path: "latestMessage",
      populate: { path: "sender", select: "-password" },
    });
    res.status(200).json(populatedChats);
  } catch (error) {
    console.error(`Error during fetch chats: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  const { chatName, users } = req.body;
  try {
    if (!chatName || !users) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (users.length < 1) {
      return res.status(400).json({ message: "Add at least 1 users" });
    }
    if (!users.includes(req.user._id.toString())) {
      users.push(req.user._id);
    }
    const chat = new Chat({
      chatName,
      isGroupChat: true,
      users,
      groupAdmin: req.user._id,
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error(`Error during create group chat: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    if (!chatId || !chatName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, groupAdmin: req.user._id },
      { chatName },
      { new: true }
    );
    if (!chat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error(`Error during rename group chat: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    if (!chatId || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const chat = await Chat.findOne({
      _id: chatId,
      groupAdmin: req.user._id,
    });
    if (!chat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    chat.users.push(userId);
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    console.error(`Error during add to group: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    if (!chatId || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const chat = await Chat.findOne({
      _id: chatId,
      groupAdmin: req.user._id,
    });
    if (!chat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    chat.users = chat.users.filter((user) => user.toString() !== userId);
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    console.error(`Error during remove from group: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const searchChat = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await User.find({
      name: { $regex: new RegExp(query, "i") },
    }).select("name email profilePic");

    const chats = await Chat.find({
      $and: [
        { chatName: { $regex: new RegExp(query, "i") } },
        { users: { $in: [req.user._id] } },
      ],
    });

    const data = [];
    for (let user of users) {
      data.push(user);
    }
    for (let chat of chats) {
      data.push(chat);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error during search users: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  searchChat,
  getGroupChat,
};
