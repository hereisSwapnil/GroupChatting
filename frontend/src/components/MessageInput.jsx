import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atom/userAtom";

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
            
      socket.emit("stopTyping", { chatId: selectedChat._id, userId: user._id,  user_image: user.profilePic });
      socket.emit("newMessage", newMessage);
      
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  socket.on("typing", (data) => {
    if (data.userId !== user._id && data.chatId === selectedChat._id) {
      console.log("Typing...");
      setOtherTyping(data.profilePic);
    }
  }
  );
  socket.on("stopTyping", (data) => {
    if (data.userId !== user._id && data.chatId === selectedChat._id) {
      console.log("Stopped typing...");
      setOtherTyping(null);
    }
  });

  return (
    <div className="">
      <div className="relative">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="message" className="sr-only">
            Send
          </label>

          <input
            type="text"
            id="message"
            placeholder="send something..."
            {...register("message", { required: true })}
            className="w-full rounded-md border-gray-200 py-4 pe-10 shadow-sm sm:text-sm"
          />
{
        otherTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce" />
            <p className="text-sm text-gray-500">Typing...</p>
          </div>
        )
      }
          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="submit" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Send</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;