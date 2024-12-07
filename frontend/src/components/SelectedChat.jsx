import React, { useEffect, useState, useRef } from "react";
import MessageInput from "./MessageInput";
import YourMessage from "./YourMessage";
import OtherMessage from "./OtherMessage";
import { useRecoilValue } from "recoil";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import { userAtom } from "../recoil/atom/userAtom";
import EditInfo from "./EditInfo";
import axios from "axios";

const SelectedChat = ({ socket }) => {
  const user = useRecoilValue(userAtom);
  const [editingInfo, setEditingInfo] = useState(false);
  const selectedChat = useRecoilValue(selectedChatAtom);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      fetchMessages();
      
      // Join the chat room when chat is selected
      socket.emit("joinChat", selectedChat._id);
    }
    
    // Cleanup - leave the chat room when component unmounts or chat changes
    return () => {
      if (selectedChat && selectedChat._id) {
        socket.emit("leaveChat", selectedChat._id);
      }
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("messageReceived", async (newMessage) => {
      if (newMessage.chat === selectedChat._id) {
        setSelectedChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Listen for typing status
    socket.on("typing", (data) => {
      if (data.userId !== user._id && data.chatId === selectedChat._id) {
        setIsTyping(true);
        setTypingUser(data.userId);
      }
    });

    socket.on("stopTyping", (data) => {
      if (data.userId !== user._id && data.chatId === selectedChat._id) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("messageReceived");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, selectedChat, user._id]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/message/${selectedChat._id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedChatMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  if (selectedChat.length !== 0) {
    return (
      <div
        className="flex flex-col h-full justify-between rounded-md"
        style={{
          backgroundImage: `url("https://mcdn.wallpapersafari.com/335/27/32/jt4AoG.jpg")`,
          height: "inherit",
          position: "absolute",
          width: "63%",
          zIndex: 0,
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center gap-4 bg-white shadow-md border-b-1 text-black px-2 py-1 rounded-md"
          style={{
            zIndex: 1,
          }}
        >
          <img
            alt=""
            src={
              selectedChat?.isGroupChat
                ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                : selectedChat.users.find((user_) => user_._id !== user._id)
                    .profilePic
            }
            className="size-14 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : selectedChat.users.find((user_) => user_._id !== user._id).name}
            </p>
            {selectedChat.users?.length === 2 && (
              <p className="text-sm font-thin">last seen: 4 days ago</p>
            )}
            {isTyping && (
              <p className="text-sm font-thin text-gray-600">
                {typingUser ? "Typing..." : ""}
              </p>
            )}
          </div>
          {selectedChat.isGroupChat && (
            <button
              className={`rounded border border-gray-600 px-4 py-1 text-sm font-medium text-gray-700 hover:bg-black hover:text-white focus:outline-none ${
                selectedChat.groupAdmin === user?._id ? "" : "hidden"
              }`}
              onClick={() => {
                setEditingInfo(true);
              }}
            >
              Edit Info
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-2"
          style={{
            zIndex: 0,
          }}
        >
          {editingInfo && (
            <EditInfo chat={selectedChat} setIsEditInfo={setEditingInfo} />
          )}
          {selectedChatMessages.map((message) =>
            message.sender._id === user._id ? (
              <YourMessage key={message._id} message={message.content} />
            ) : (
              <OtherMessage
                key={message._id}
                message={message.content}
                image={message.sender.profilePic}
                name={message.sender.name}
              />
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div>
          <MessageInput
            chatId={selectedChat?._id}
            socket={socket}
            setMessages={setSelectedChatMessages}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex flex-col justify-between rounded-md"
        style={{
          backgroundImage: `url("https://mcdn.wallpapersafari.com/335/27/32/jt4AoG.jpg")`,
          height: "inherit",
          position: "absolute",
          width: "63%",
          zIndex: 0,
        }}
      ></div>
    );
  }
};

export default SelectedChat;