import axios from "axios";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import { userAtom } from "../recoil/atom/userAtom";

const Chats = () => {
  const [chats, setChats] = useRecoilState(chatsAtom);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

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
      {user?.name}
      <br />
      {user?._id}
      <br />
      {user?.email}
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        logout
      </button>
      <ChatContainer />
    </div>
  );
};

export default Chats;
