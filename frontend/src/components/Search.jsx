import React, { useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { chatsAtom } from "../recoil/atom/chatsAtom";
import AddGroup from "./AddGroup";
import { Search as SearchIcon, Plus } from "lucide-react";

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
      setChats(response.data);
    } catch (error) {
      console.error(error);
    }
  }, 300);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex items-center gap-2">
      {isAddGroup && <AddGroup setIsAddGroup={setIsAddGroup} />}
      
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full bg-dark-lighter/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <button
        onClick={() => setIsAddGroup(true)}
        className="p-2.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl transition-colors border border-primary/20"
        title="New Group"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Search;
