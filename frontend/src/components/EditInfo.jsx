import React, { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

const EditInfo = ({ chat, setIsEditInfo }) => {
  const [chatName, setChatName] = useState(chat.chatName);
  const [members, setMembers] = useState(chat.users);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        console.log(response.data);
        setMembers((prevMembers) => [...prevMembers, user]);
        setSearchTerm("");
        setSearchResults([]);
        toast.success("Member added successfully");
      })
      .catch((error) => {
        console.error(error);
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
        console.log(response.data);
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m._id !== member._id)
        );
        toast.success("Member removed successfully");
      })
      .catch((error) => {
        console.error(error);
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

  return (
    <div className="z-20 absolute h-[67.6vh] w-[62.9vw] border border-gray-300 flex flex-col m-auto bg-white shadow-lg rounded-md p-6">
      <div className="w-auto flex flex-row justify-between">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Edit Chat Info</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5 cursor-pointer"
          onClick={() => setIsEditInfo(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={handleChatNameChange}
            className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Add Members"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
          />
        </div>

        <div className="overflow-y-scroll">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => handleAddMember(user)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {user.name}
            </div>
          ))}
        </div>

        <div className="overflow-y-scroll">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 border-b border-gray-300"
            >
              <span>{member.name}</span>
              <button
                onClick={() => handleRemoveMember(member)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-md border border-gray-600 bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditInfo;
