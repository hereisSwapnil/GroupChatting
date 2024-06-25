import React from "react";
import ChatLabel from "./ChatLabel";
import Search from "./Search";
import SelectedChat from "./SelectedChat";
import { useRecoilValue } from "recoil";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { userAtom } from "../recoil/atom/userAtom";

const ChatContainer = () => {
  const chats = useRecoilValue(chatsAtom);
  const user = useRecoilValue(userAtom);

  return (
    <div className="border-[1px] border-gray-500 flex flex-row m-auto bg-gray-100 shadow-lg w-[90vw] h-[80vh] rounded-md">
      <div className="w-[30%] border-r-[1px] h-[79vh] overflow-y-scroll">
        <Search />
        {chats &&
          chats.map((chat) => (
            <ChatLabel
              _id={chat._id}
              isChatCreated={
                chat?.chatName
                  ? chat.chatName === "sender"
                    ? true
                    : false
                  : false
              }
              key={chat._id}
              name={
                chat?.chatName
                  ? chat.chatName !== "sender"
                    ? chat.chatName
                    : chat?.users
                    ? chat.users.map((user_) => {
                        if (user_._id !== user._id) {
                          return user_.name;
                        }
                      })[0]
                    : chat?.name
                  : chat.name
              }
              chat={chat}
              latestMessage={chat?.message}
            />
          ))}
      </div>
      <div className="w-[70%] flex flex-col rounded-md bg-gray-100">
        <SelectedChat />
      </div>
    </div>
  );
};

export default ChatContainer;
