import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import debounce from "lodash.debounce";
import UserBadge from "./UserBadge";
import { toast } from "react-toastify";

const EditProfile = ({ setEditingProfile }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = (data) => {
    console.log("Group Data:", data);
    const groupMembers = members.map((member) => member._id);
    console.log("Group Members:", groupMembers);
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
        console.log(response.data);
        setEditingProfile(false);
        toast.success("Group created successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error creating group");
      });
  };

  // Debounced function to search users
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
        // Filter out already selected members
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
    <div className="z-20 absolute h-[79.5vh] w-[62.8vw] border border-gray-300 flex flex-col m-auto bg-white shadow-lg rounded-md p-6">
      <div className="w-auto flex flex-row justify-between">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5 cursor-pointer"
          onClick={() => setEditingProfile(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Group Name"
            {...register("groupName", { required: true })}
            className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
          />
          {errors.groupName && (
            <p className="text-red-500 text-xs mt-1">Group Name is required</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Add Members"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
          />
          {errors.groupMembers && (
            <p className="text-red-500 text-xs mt-1">Members are required</p>
          )}
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
            <UserBadge
              key={index}
              name={member.name}
              members={members}
              setMembers={setMembers}
              _id={member._id}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-md border border-gray-600 bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
