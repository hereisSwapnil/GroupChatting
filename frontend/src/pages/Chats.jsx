import axios from "axios";
import React, { useEffect, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import { userAtom } from "../recoil/atom/userAtom";
import { notificationAtom } from "../recoil/atom/notificationAtom";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import Loading from "../components/Loading";

const Chats = ({ socket }) => {
  const [chats, setChats] = useRecoilState(chatsAtom);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const hasShownLoginError = useRef(false);

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/chat`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setChats(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error in loading chats");
    }
  }, [setChats]);

  // Fetch chats when user changes (on login/signup)
  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      fetchChats();
    } else {
      // Clear chats if no user
      setChats([]);
    }
  }, [user, fetchChats, setChats]);

  const [notification, setNotification] = useRecoilState(notificationAtom);
  const selectedChat = useRecoilValue(selectedChatAtom);

  // Clear notifications when user changes
  useEffect(() => {
    if (user) {
      setNotification([]);
    }
  }, [user, setNotification]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      if (!hasShownLoginError.current) {
        hasShownLoginError.current = true;
        toast.error("Please login to view chats");
      }
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageChannel = async (newMessage) => {
      // Only add to notifications if message is not for the currently selected chat
      if (!selectedChat || selectedChat._id !== newMessage.chat) {
        // Use functional update to avoid stale closure
        setNotification(prevNotification => {
          if (prevNotification.some(n => n._id === newMessage._id)) {
            return prevNotification;
          }
          return [newMessage, ...prevNotification];
        });
        
        // Update chats list to show latest message
        setChats(prevChats => {
          // Check if chat exists
          const chatExists = prevChats.some(chat => chat._id === newMessage.chat);
          
          if (!chatExists) {
            // Chat doesn't exist, fetch it from backend
            axios.get(
              `${import.meta.env.VITE_BASE_API}/chat`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((response) => {
              setChats(response.data);
            })
            .catch((error) => {
              console.error("Error fetching chats:", error);
            });
            
            return prevChats; // Return current chats while fetching
          }
          
          // Chat exists, update it
          const updatedChats = prevChats.map(chat => {
            if (chat._id === newMessage.chat) {
              return { ...chat, latestMessage: newMessage };
            }
            return chat;
          });
          
          // Move updated chat to top
          const chatToMove = updatedChats.find(c => c._id === newMessage.chat);
          const otherChats = updatedChats.filter(c => c._id !== newMessage.chat);
          return chatToMove ? [chatToMove, ...otherChats] : updatedChats;
        });
      }
    };

    socket.on("messageChannel", handleMessageChannel);

    return () => {
      socket.off("messageChannel", handleMessageChannel);
    };
  }, [socket, selectedChat, setNotification, setChats]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[1600px] h-[90vh] relative z-10">
        <ChatContainer socket={socket} />
      </div>
    </div>
  );
};

export default Chats;
