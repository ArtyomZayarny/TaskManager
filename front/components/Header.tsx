"use client";

import { AppContext } from "@/context/app-context";
import React, { useContext } from "react";

import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { ProfileIcon } from "./ProfileIcon";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { BackGround } from "./BackGround";

export const Header = () => {
  const { setIsModalOpen, isModalOpen, isLogged, isLoading } =
    useContext(AppContext);

  return (
    <div className="flex justify-between items-center p-5 bg-gray-500/10">
      <BackGround />
      <Logo />

      <div className="flex items-center space-x-5 flex-1 justify-end w-full">
        <SearchBar />
        {isLogged ? (
          <ProfileIcon />
        ) : (
          <UserCircleIcon
            onClick={() => setIsModalOpen(!isModalOpen)}
            className={` cursor-pointer inline-block h-10 w-10 text-[#000] mr-1 ${
              isLoading && "animate-spin"
            }`}
          />
        )}
      </div>
    </div>
  );
};
