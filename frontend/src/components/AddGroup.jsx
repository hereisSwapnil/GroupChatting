import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import debounce from "lodash.debounce";
import UserBadge from "./UserBadge";
import { toast } from "react-toastify";
import { X, Search, Users } from "lucide-react";

const AddGroup = ({ setIsAddGroup }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = (data) => {
    const groupMembers = members.map((member) => member._id);
    axios
      .post(
        `${import.meta.env.VITE_BASE_API}/chat/group`,
        {
          chatName: data.groupName,
          isGroupChat: true,
          users: groupMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setIsAddGroup(false);
        toast.success("Group created successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error creating group");
      });
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

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleAddMember = (user) => {
    setMembers((prevMembers) => [...prevMembers, user]);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-2xl relative animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            New Group
          </h1>
          <button
            onClick={() => setIsAddGroup(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g. Project Team"
              {...register("groupName", { required: true })}
              className="input-field"
            />
            {errors.groupName && (
              <p className="text-red-500 text-xs mt-1">Group Name is required</p>
            )}
          </div>

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
            {errors.groupMembers && (
              <p className="text-red-500 text-xs mt-1">Members are required</p>
            )}
          </div>

          {/* Selected Members */}
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {members.map((member, index) => (
              <UserBadge
                key={index}
                name={member.name}
                members={members}
                setMembers={setMembers}
                _id={member._id}
              />
            ))}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
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

          <button
            type="submit"
            className="btn-primary w-full flex justify-center items-center gap-2"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
