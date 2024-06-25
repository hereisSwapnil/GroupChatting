import axios from "axios";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";

const Chats = () => {
  const [chats, setChats] = useRecoilState(chatsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
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
        console.log(response.data);
        console.log(chats);
      } catch (error) {
        console.error(error);
        toast.error("Error in loading chats");
      }
    };

    fetchChats();
  }, [setChats]);

  return (
    <div>
      <h1>chats</h1>
      <ChatContainer />
    </div>
  );
};

export default Chats;
