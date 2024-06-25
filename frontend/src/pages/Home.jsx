import React from "react";
import Login from "./SignUp";
import SignUp from "./SignUp";
import { useRecoilValue } from "recoil";
import { chatsAtom } from "../recoil/atom/chatsAtom";

const Home = () => {
  const chats = useRecoilValue(chatsAtom);
  console.log(chats);

  return (
    <div>
      <h1>Home</h1>
      <div>
        {chats.map((chat) => (
          <div key={chat._id}>
            <h3>{chat.chatName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
