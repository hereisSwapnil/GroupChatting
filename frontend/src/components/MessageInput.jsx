import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atom/userAtom";
import { Send } from "lucide-react";

const MessageInput = ({ chatId, socket, setMessages }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const selectedChat = useRecoilValue(selectedChatAtom);
  const user = useRecoilValue(userAtom);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [otherTyping, setOtherTyping] = useState(null);

  const messageContent = watch("message");

  useEffect(() => {
    if (messageContent && !typing) {
      setTyping(true);
      socket.emit("typing", { chatId: selectedChat._id, userId: user._id, user_image: user.profilePic });
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      if (typing) {
        socket.emit("stopTyping", { chatId: selectedChat._id, userId: user._id,  user_image: user.profilePic });
        setTyping(false);
      }
    }, 2000);

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [messageContent]);

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/message`,
        {
          content: data.message,
          chatId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newMessage = {
        ...response.data,
        chat: chatId, // Ensure this is the string ID
        sender: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        }
      };
            
      if (socket.connected) {
        socket.emit("stopTyping", { chatId: selectedChat._id, userId: user._id,  user_image: user.profilePic });
        socket.emit("newMessage", newMessage);
      } else {
        console.warn("Socket not connected, message sent via API but not broadcasted via socket");
      }
      
      // Optimistically update UI
      setMessages((prev) => [...prev, newMessage]);
      
      // Play sent sound
      new Audio("/sent.wav").play().catch(e => console.log("Audio play failed:", e));

      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data) => {
      if (data.userId !== user._id && data.chatId === selectedChat._id) {
        setOtherTyping(data.profilePic);
      }
    };

    const handleStopTyping = (data) => {
      if (data.userId !== user._id && data.chatId === selectedChat._id) {
        setOtherTyping(null);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedChat, user._id]);

  return (
    <div className="relative">
      {otherTyping && (
        <div className="absolute -top-8 left-0 flex items-center space-x-2 bg-dark/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs text-gray-300">Typing...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="relative flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          autoComplete="off"
          {...register("message")}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
        />
        
        <button 
          type="submit" 
          className="absolute right-2 p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-lg shadow-primary/25"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;