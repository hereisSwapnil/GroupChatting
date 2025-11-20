import React, { useEffect, useState, useRef } from "react";
import MessageInput from "./MessageInput";
import YourMessage from "./YourMessage";
import OtherMessage from "./OtherMessage";
import { useRecoilValue } from "recoil";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import { userAtom } from "../recoil/atom/userAtom";
import EditInfo from "./EditInfo";
import axios from "axios";
import { MoreVertical, Phone, Video } from "lucide-react";

const SelectedChat = ({ socket }) => {
  const user = useRecoilValue(userAtom);
  const [editingInfo, setEditingInfo] = useState(false);
  const selectedChat = useRecoilValue(selectedChatAtom);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  useEffect(() => {
    if (selectedChat && selectedChat._id && socket) {
      fetchMessages();
      
      // Join chat immediately if connected
      if (socket.connected) {
        socket.emit("joinChat", selectedChat._id);
      }

      // Also listen for connect event to rejoin if socket reconnects
      const onConnect = () => {
        socket.emit("joinChat", selectedChat._id);
      };

      socket.on("connect", onConnect);

      return () => {
        socket.off("connect", onConnect);
        socket.emit("leaveChat", selectedChat._id);
      };
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("messageReceived", async (newMessage) => {
      if (newMessage.chat === selectedChat._id) {
        setSelectedChatMessages((prevMessages) => {
          // Prevent duplicates if message was already added optimistically
          if (prevMessages.some(msg => msg._id === newMessage._id)) {
            return prevMessages;
          }
          // Play received sound only if it's from another user
          if (newMessage.sender._id !== user._id) {
            new Audio("/recieved.wav").play().catch(e => console.log("Audio play failed:", e));
          }
          return [...prevMessages, newMessage];
        });
      }
    });

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

  if (!selectedChat || selectedChat.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-400">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Chat Selected</h3>
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  const isGroupChat = selectedChat.isGroupChat;
  const otherUser = !isGroupChat && selectedChat.users.find((u) => u._id !== user._id);
  const chatName = isGroupChat ? selectedChat.chatName : otherUser?.name;
  const chatImage = isGroupChat 
    ? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    : otherUser?.profilePic;

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Chat Header */}
      <div className="h-20 px-6 border-b border-white/5 flex items-center justify-between bg-dark/30 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <img
            src={chatImage}
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
          <div>
            <h3 className="font-bold text-white">{chatName}</h3>
            {isTyping ? (
              <p className="text-xs text-primary animate-pulse">Typing...</p>
            ) : (
              <p className="text-xs text-gray-400">
                {isGroupChat ? `${selectedChat.users.length} members` : "Online"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setEditingInfo(true)}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
            title="Chat Info"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        {editingInfo && (
          <div className="absolute inset-0 z-50 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card p-1 max-w-md w-full rounded-2xl relative">
              <button 
                onClick={() => setEditingInfo(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                ✕
              </button>
              <EditInfo chat={selectedChat} setIsEditInfo={setEditingInfo} currentUser={user} />
            </div>
          </div>
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
      <div className="p-4 bg-dark/30 border-t border-white/5 backdrop-blur-md">
        <MessageInput
          chatId={selectedChat?._id}
          socket={socket}
          setMessages={setSelectedChatMessages}
        />
      </div>
    </div>
  );
};

export default SelectedChat;