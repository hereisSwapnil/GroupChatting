import React, { useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import AddGroup from "./AddGroup";

const Search = () => {
  const [isAddGroup, setIsAddGroup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const setChats = useSetRecoilState(chatsAtom);

  const debouncedSearch = debounce(async (searchTerm) => {
    if (!searchTerm) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/chat`,
          {
            params: { searchTerm },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setChats(response.data);
      } catch (error) {
        console.error(error);
      }
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/user/search?query=${searchTerm}`,
        {
          params: { searchTerm },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      //   console.log(response.data);
      setChats(response.data);
    } catch (error) {
      console.error(error);
      // Handle error as needed
    }
  }, 300); // 300ms debounce delay

  // Handler for input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value); // Call debounce function with input value
  };

  return (
    <div className="flex flex-row w-full justify-between">
      {isAddGroup && <AddGroup setIsAddGroup={setIsAddGroup} />}
      <div className="relative w-full">
        <label htmlFor="Search" className="sr-only">
          {" "}
          Search{" "}
        </label>
        <input
          type="text"
          id="Search"
          placeholder="Search for..."
          className="w-full rounded-md border-gray-200 py-5 pe-10 shadow-sm sm:text-sm"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
          <button type="button" className="text-gray-600 hover:text-gray-700">
            <span className="sr-only">Search</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </span>
      </div>
      <button
        className="rounded border border-gray-600 px-4 py-1 text-sm font-medium text-gray-700 hover:bg-black hover:text-white focus:outline-none"
        onClick={() => {
          setIsAddGroup(true);
        }}
      >
        New Group
      </button>
    </div>
  );
};

export default Search;
