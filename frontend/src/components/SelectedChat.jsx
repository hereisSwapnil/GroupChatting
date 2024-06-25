import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import YourMessage from "./YourMessage";
import OtherMessage from "./OtherMessage";
import { useRecoilValue } from "recoil";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import { userAtom } from "../recoil/atom/userAtom";
import EditInfo from "./EditInfo";
import axios from "axios";

const SelectedChat = () => {
  const user = useRecoilValue(userAtom);
  const [editingInfo, setEditingInfo] = useState(false);
  const selectedChat = useRecoilValue(selectedChatAtom);

  const [selectedChatMessages, setSelectedChatMessages] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_API}/message/${selectedChat._id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSelectedChatMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedChat]);

  if (selectedChat.length !== 0) {
    return (
      <div
        className="flex flex-col justify-between h-full rounded-md"
        style={{
          backgroundImage: `url("https://mcdn.wallpapersafari.com/335/27/32/jt4AoG.jpg")`,
        }}
      >
        <div className="flex items-center gap-4 bg-white shadow-md border-b-1 text-black px-2 py-1 rounded-md">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
            className="size-14 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">
              {selectedChat.chatName === "sender"
                ? selectedChat.users?.map((user_) => {
                    if (user_._id !== user._id) {
                      return user_.name;
                    }
                  })[0]
                : selectedChat.chatName}
            </p>
            {selectedChat.users?.length == 2 && (
              <p className="text-sm font-thin">last seen: 4days</p>
            )}
          </div>

          {selectedChat.users?.length > 2 &&
            selectedChat.groupAdmin === user._id && (
              <button
                className="rounded border border-gray-600 px-4 py-1 text-sm font-medium text-gray-700 hover:bg-black hover:text-white focus:outline-none"
                onClick={() => {
                  setEditingInfo(true);
                }}
              >
                Edit Info
              </button>
            )}
        </div>
        <div
          className={`flex flex-col h-full justify-end ${
            editingInfo ? "" : "pb-3"
          } relative`}
        >
          {editingInfo && (
            <EditInfo chat={selectedChat} setIsEditInfo={setEditingInfo} />
          )}

          <YourMessage />
          <OtherMessage />
        </div>
        <div>
          <MessageInput />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex flex-col justify-between h-full rounded-md"
        style={{
          backgroundImage: `url("https://mcdn.wallpapersafari.com/335/27/32/jt4AoG.jpg")`,
        }}
      ></div>
    );
  }
};

export default SelectedChat;
