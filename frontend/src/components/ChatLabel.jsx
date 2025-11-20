import React from "react";
import { useRecoilState } from "recoil";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import { notificationAtom } from "../recoil/atom/notificationAtom";
import axios from "axios";
import clsx from "clsx";

const ChatLabel = ({ chat, currentUser }) => {
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const [notification, setNotification] = useRecoilState(notificationAtom);

  // Determine if input is a user object (from search) or a chat object
  const isUserResult = !chat.users && !chat.chatName && chat.name;

  // Determine chat name and image
  const isGroupChat = chat.isGroupChat;
  
  let otherUser;
  if (isUserResult) {
    otherUser = chat;
  } else {
    otherUser = !isGroupChat && chat.users ? chat.users.find((u) => u._id !== currentUser._id) : null;
  }
  
  const chatName = isUserResult ? chat.name : (isGroupChat ? chat.chatName : otherUser?.name || "Unknown User");
  const chatImage = isUserResult 
    ? chat.profilePic 
    : (isGroupChat 
      ? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
      : otherUser?.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");

  // For user results, we can't easily match selectedChat._id (which is a chat ID) with chat._id (which is a user ID)
  // So we might not highlight it, or we could check if selectedChat is a 1-on-1 with this user.
  // For now, simple ID match is safe enough to prevent crashes.
  const isSelected = selectedChat?._id === chat._id;

  // Calculate unread notifications for this chat
  const unreadCount = !isUserResult ? notification.filter(n => n.chat === chat._id).length : 0;

  const handleSelectedChat = async () => {
    try {
      let response;
      if (isUserResult || !isGroupChat) {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_API}/chat`,
          { userId: otherUser._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_API}/chat/group/get`,
          { chatId: chat._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      setSelectedChat(response.data);
      
      // Clear notifications for this chat
      if (!isUserResult) {
        setNotification(notification.filter(n => n.chat !== chat._id));
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  return (
    <div
      onClick={handleSelectedChat}
      data-chat-id={chat._id}
      className={clsx(
        "mx-2 mb-2 p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3",
        isSelected 
          ? "bg-primary text-white shadow-lg shadow-primary/25" 
          : "hover:bg-white/5 text-gray-300 hover:text-white"
      )}
    >
      <div className="relative">
        <img
          src={chatImage}
          alt={chatName}
          className="w-12 h-12 rounded-full object-cover border border-white/10"
        />
        {/* Online indicator could go here */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className={clsx("font-semibold truncate", isSelected ? "text-white" : "text-gray-200")}>
            {chatName}
          </h4>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm shadow-red-500/50">
              {unreadCount}
            </div>
          )}
        </div>
        
        {chat.latestMessage && !isUserResult && (
          <p className={clsx("text-sm truncate", isSelected ? "text-white/80" : "text-gray-500")}>
            {isGroupChat && <span className="font-medium">{chat.latestMessage.sender.name}: </span>}
            {chat.latestMessage.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatLabel;
