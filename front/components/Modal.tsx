"use client";

import { AppContext } from "@/context/app-context";
import { Dialog } from "@headlessui/react";
import React, { useContext, useState } from "react";

export const Modal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    setIsLoged,
    setIsLoading,
    isLoading,
    setError,
    error,
  } = useContext(AppContext);
  const [email, setEmail] = useState("timaz@gmail.com");
  const [password, setPassword] = useState("travis182");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const creads = { login: email, password };
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        body: JSON.stringify(creads),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();

      //Check Errors
      if (!response.error) {
        if (!localStorage.getItem("access_token")) {
          localStorage.setItem(
            "access_token",
            JSON.stringify(response?.access_token)
          );
        }
        setIsModalOpen(false);
        setIsLoged(true);
        setIsLoading(false);
      }
      console.log("response", response);
      setIsLoading(false);
      setError(response.message);
    } catch (e) {
      console.log("errror", e);
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="relative z-50 w-full max-w-md s"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel
          className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left
            align-middle shadow-xl transition-all"
        >
          <Dialog.Title className="px-5 text-center font-bold mb-5">
            Login
          </Dialog.Title>
          <form onSubmit={onSubmitHandler} className=" w-300">
            <div className="mb-5">
              <input
                className="w-full border border-gray-300 rounded-md outline-none p-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <input
                className="w-full border border-gray-300 rounded-md outline-none p-2"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="mb-5">
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oh, snapp! </span>
                  <span className="font-medium">{error}</span>
                </p>
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            >
              <div className="text-center w-full">
                {isLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {isLoading ? "Loading..." : "Log in"}
              </div>
            </button>
          </form>

          {/* ... */}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
