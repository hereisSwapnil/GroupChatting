import React, { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import { X, Search, UserCog, Trash2, Save } from "lucide-react";

const EditInfo = ({ chat, setIsEditInfo, currentUser }) => {
  const [chatName, setChatName] = useState(chat.chatName);
  const [members, setMembers] = useState(chat.users);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = currentUser?._id === chat.groupAdmin;

  const handleChatNameChange = (e) => {
    setChatName(e.target.value);
  };

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/user/search`,
          {
            params: { query: term },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filteredResults = response.data.filter(
          (user) => !members.some((member) => member._id === user._id)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error(error);
      }
    }, 300),
    [members]
  );

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleAddMember = (user) => {
    axios
      .put(
        `${import.meta.env.VITE_BASE_API}/chat/group/add`,
        {
          chatId: chat._id,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setMembers((prevMembers) => [...prevMembers, user]);
        setSearchTerm("");
        setSearchResults([]);
        toast.success("Member added successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add member");
      });
  };

  const handleRemoveMember = (member) => {
    axios
      .put(
        `${import.meta.env.VITE_BASE_API}/chat/group/remove`,
        {
          chatId: chat._id,
          userId: member._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m._id !== member._id)
        );
        toast.success("Member removed successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to remove member");
      });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_API}/chat/group`,
        {
          chatName,
          chatId: chat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsEditInfo(false);
      toast.success("Chat info updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating chat info");
    }
  };

  const isGroupChat = chat.isGroupChat;

  if (!isGroupChat) {
    const otherUser = chat.users.find((u) => u._id !== currentUser?._id);
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-primary to-accent mb-4">
          <img
            src={otherUser?.profilePic}
            alt={otherUser?.name}
            className="w-full h-full rounded-full object-cover border-4 border-dark-card"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{otherUser?.name}</h2>
        <p className="text-gray-400 text-sm mb-6">{otherUser?.email}</p>
        
        <div className="w-full space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">User ID</p>
              <p className="text-white font-medium text-sm">{otherUser?._id}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCog className="w-5 h-5 text-primary" />
          {isAdmin ? "Edit Group Info" : "Group Info"}
        </h1>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Chat Name
          </label>
          <input
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={handleChatNameChange}
            disabled={!isAdmin}
            className={`input-field ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Add Members
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="input-field pl-10"
              />
            </div>
          </div>
        )}

        {/* Search Results */}
        {isAdmin && searchResults.length > 0 && (
          <div className="max-h-40 overflow-y-auto custom-scrollbar bg-dark-lighter/50 rounded-xl border border-white/10">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleAddMember(user)}
                className="p-3 hover:bg-primary/20 cursor-pointer transition-colors flex items-center gap-3"
              >
                <img 
                  src={user.profilePic} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-200">{user.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Members List */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Members
          </label>
          <div className="space-y-2">
            {members.map((member, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={member.profilePic} 
                    alt={member.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-200">{member.name}</span>
                </div>
                {isAdmin && member._id !== currentUser?._id && (
                  <button
                    onClick={() => handleRemoveMember(member)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="pt-4 mt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            className="btn-primary w-full flex justify-center items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default EditInfo;
