import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedChatAtom } from "../recoil/atom/selectedChatAtom";
import axios from "axios";
import { userAtom } from "../recoil/atom/userAtom";

const ChatLabel = ({ name, latestMessage, _id, isChatCreated, chat }) => {
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const user = useRecoilValue(userAtom);

  const handleSelectedChat = () => {
    setSelectedChat([]);
    if (isChatCreated && chat.chatName === "sender") {
      _id = chat.users.map((user_) => {
        if (user_._id !== user._id) {
          return user_._id;
        }
      })[0];
    }
    if (chat.users.length === 2) {
      axios
        .post(
          `${import.meta.env.VITE_BASE_API}/chat`,
          {
            userId: _id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setSelectedChat(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post(
          `${import.meta.env.VITE_BASE_API}/chat/group/get`,
          {
            chatId: _id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setSelectedChat(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <article
      className="rounded-xl border-2 border-gray-100 bg-white py-1 px-2 cursor-pointer"
      onClick={handleSelectedChat}
    >
      <div className="flex items-start gap-4">
        <a href="#" className="w-14">
          <img
            alt=""
            src={
              chat.users.length > 2
                ? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                : chat.users.map((user_) => {
                    if (user_._id !== user._id) {
                      return user_.profilePic;
                    }
                  })[0]
            }
            className="size-14 rounded-full object-cover"
          />
        </a>

        <div className="flex flex-col items-center align-middle">
          <p className="text-sm font-semibold">
            {name?.length > 25 ? name.slice(0, 25) + "..." : name}
          </p>

          {latestMessage && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">
                {latestMessage?.user?.name}:{" "}
              </span>
              {latestMessage?.content.length > 20
                ? latestMessage?.content.slice(0, 20) + "..."
                : latestMessage?.content}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ChatLabel;
