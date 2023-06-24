import { AppContext } from "@/context/app-context";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useContext } from "react";

export const SearchBar = () => {
  const { searchString, setSearchString } = useContext(AppContext);
  return (
    <form
      action=""
      className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md
    flex-1 md:flex-initial"
    >
      <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="flex-1 outline-none p-2"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      <button type="submit" hidden>
        Search
      </button>
    </form>
  );
};
