"use client";

import { AppContext } from "@/context/app-context";
import { Menu } from "@headlessui/react";
import Image from "next/image";
import React, { useContext } from "react";
import Avatar from "react-avatar";
import { Fragment } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export const Header = () => {
  const {
    setIsModalOpen,
    isModalOpen,
    isLogged,
    logOut,
    isLoading,
    setIsLoading,
  } = useContext(AppContext);

  const links = [{ href: "/profile", label: "Profile" }];

  const handleSignOut = async () => {
    await logOut();
  };

  return (
    <div className="flex justify-between items-center p-5 bg-gray-500/10">
      <div
        className="absolute top-0
        left-0
        w-full
        h-96
        bg-gradient-to-br
        from-pink-400
        to-[#0055D1]
        rounded-md
        filter
        blur-3xl
        opacity-50
        -z-50
        "
      />
      <Image
        src="http://links.papareact.com/c2cdd5"
        alt="Trello Logo"
        width={300}
        height={100}
        className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
      />

      {/* Form */}

      {/* User login */}
      <div>
        {/* Icon */}
        {isLogged ? (
          <Menu>
            <Menu.Button>
              <Avatar name="Artem Zaiarnyi" round color="#0055D1" size="40" />
            </Menu.Button>

            <Menu.Items className="p-5 bg-slate-100 rounded-lg flex flex-col absolute right-0 mt-2 w-56 origin-top-right">
              {links.map((link) => (
                /* Use the `active` state to conditionally style the active item. */
                <Menu.Item key={link.href} as={Fragment}>
                  {({ active }) => (
                    <a
                      href={link.href}
                      className={`p-2 rounded-sm ${
                        active
                          ? "bg-gray-200 text-gray "
                          : "bg-slate-100 text-black"
                      }`}
                    >
                      {link.label}
                    </a>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item
                key="sign-out"
                as="div"
                className={`p-2 rounded-sm hover:bg-gray-200 cursor-pointer`}
                onClick={handleSignOut}
              >
                Sign Out
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <UserCircleIcon
            onClick={() => setIsModalOpen(!isModalOpen)}
            className={`inline-block h-10 w-10 text-[#000] mr-1 ${
              isLoading && "animate-spin"
            }`}
          />
        )}
      </div>
    </div>
  );
};
