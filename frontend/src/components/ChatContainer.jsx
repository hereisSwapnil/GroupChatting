import React, { useState } from "react";
import ChatLabel from "./ChatLabel";
import Search from "./Search";
import SelectedChat from "./SelectedChat";
import { useRecoilValue } from "recoil";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { userAtom } from "../recoil/atom/userAtom";
import EditProfile from "./EditProfile";

const ChatContainer = () => {
  const chats = useRecoilValue(chatsAtom);
  const user = useRecoilValue(userAtom);

  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <div className="border-[1px] border-gray-500 flex flex-row m-auto bg-gray-100 shadow-lg w-[90vw] h-[80vh] rounded-md">
      <div className="w-[30%] border-r-[1px] h-[79vh] overflow-auto">
        <div className="flex flex-row-reverse justify-between align-middle items-center px-2 py-1 bg-white rounded-md">
          <h1 className="font-semibold">GroupChatting.</h1>
          <img
            src={user?.profilePic}
            alt=""
            className="cursor-pointer size-14 rounded-full object-cover border-2 p-[1px] border-black outline-offset-2"
            onClick={() => {
              setEditingProfile(!editingProfile);
            }}
          />
        </div>
        <Search />
        {chats &&
          chats
            .filter((chat) => chat?.latestMessage)
            .map((chat) => (
              <ChatLabel
                _id={
                  chat.isGroupChat
                    ? chat._id
                    : (chat.users &&
                        chat.users.find((user_) => user_._id !== user._id)
                          ?._id) ||
                      chat._id
                }
                isChatCreated={
                  chat?.chatName ? chat.chatName !== "sender" : false
                }
                key={chat._id}
                name={
                  chat.isGroupChat
                    ? chat.chatName
                    : (chat.users &&
                        chat.users.find((user_) => user_._id !== user._id)
                          ?.name) ||
                      chat?.name
                }
                chat={chat}
                latestMessage={chat?.latestMessage}
              />
            ))}
      </div>
      <div className="w-[70%] flex flex-col rounded-md bg-gray-100">
        {editingProfile && (
          <EditProfile setEditingProfile={setEditingProfile} />
        )}
        <SelectedChat />
      </div>
    </div>
  );
};

export default ChatContainer;
