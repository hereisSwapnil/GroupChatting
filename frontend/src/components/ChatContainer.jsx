import React, { useState } from "react";
import ChatLabel from "./ChatLabel";
import Search from "./Search";
import SelectedChat from "./SelectedChat";
import { useRecoilValue } from "recoil";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import { userAtom } from "../recoil/atom/userAtom";
import EditProfile from "./EditProfile";
import { Settings, LogOut } from "lucide-react";

const ChatContainer = ({ socket }) => {
  const chats = useRecoilValue(chatsAtom);
  const user = useRecoilValue(userAtom);
  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <div className="glass-card w-full h-full rounded-2xl flex overflow-hidden shadow-2xl border border-white/10">
      {/* Sidebar */}
      <div className="w-[350px] bg-dark-card/50 border-r border-white/5 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-dark/30">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setEditingProfile(true)}>
              <img
                src={user?.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/50 group-hover:border-primary transition-colors"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">{user?.name}</h3>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <Search />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats && chats.length > 0 ? (
            chats.map((chat) => (
              <ChatLabel
                key={chat._id}
                chat={chat}
                currentUser={user}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No chats yet. Start a conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-dark/20 relative">
        {editingProfile && (
          <div className="absolute inset-0 z-50 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card p-1 max-w-md w-full rounded-2xl relative">
              <button 
                onClick={() => setEditingProfile(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <EditProfile setEditingProfile={setEditingProfile} />
            </div>
          </div>
        )}
        <SelectedChat socket={socket} />
      </div>
    </div>
  );
};

export default ChatContainer;
