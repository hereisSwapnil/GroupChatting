const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  try {
    if (!content || !chatId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const chat = await Chat.findOne({
      _id: chatId,
    });
    if (!chat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    const newMessage = new Message({
      sender: req.user._id,
      content,
      chat: chatId,
    });
    await newMessage.save();
    chat.latestMessage = newMessage._id;
    await chat.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(`Error during send message: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "-password")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error during get messages: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
