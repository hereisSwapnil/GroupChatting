import axios from "axios";
import React, { useEffect, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import { userAtom } from "../recoil/atom/userAtom";
import Loading from "../components/Loading";

const Chats = () => {
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
      console.log(response.data);
      console.log(chats);
    } catch (error) {
      console.error(error);
      toast.error("Error in loading chats");
    }
  }, [setChats]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchChats();
    }
  }, [fetchChats]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      if (!hasShownLoginError.current) {
        hasShownLoginError.current = true;
        toast.error("Please login to view chats");
      }
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }, [navigate]);
  if (user.length === 0) {
    return <Loading />;
  }

  return (
    <div>
      <h1>chats</h1>
      {user?.name}
      <br />
      {user?._id}
      <br />
      {user?.email}
      <br />
      <button onClick={handleLogout}>logout</button>
      <ChatContainer />
    </div>
  );
};

export default Chats;
