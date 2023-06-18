"use client";

import { AppContext } from "@/context/app-context";
import { Dialog } from "@headlessui/react";
import React, { useContext, useState } from "react";
import { Button } from "./Button";
import Link from "next/link";

export const Modal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    setIsLoged,
    setIsLoading,
    isLoading,
    setError,
    error,
    modalType,
    setModalType,
  } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [congrats, setCongrat] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const creads = { login: email, password };
    setIsLoading(true);
    return signIn ? login(creads) : register(creads);
  };
  const signIn = modalType === "Sign in";

  const toggleModalTypeHandler = () => {
    signIn ? setModalType("Sign up") : setModalType("Sign in");
  };

  const login = async (creads) => {
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

  const register = async (creads) => {
    console.log("register", creads);
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
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
        setCongrat(true);
        console.log("User successfully registered");
        // if (!localStorage.getItem("access_token")) {
        //   localStorage.setItem(
        //     "access_token",
        //     JSON.stringify(response?.access_token)
        //   );
        // }
        // setIsModalOpen(false);
        // setIsLoged(true);
        // setIsLoading(false);
      }
      console.log("response", response);
      setIsLoading(false);
      setError(response.message);
    } catch (e) {
      console.log("errror", e);
      setIsLoading(false);
    }
  };

  const AuthForm = () => {
    return (
      <>
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
          <Button
            type="submit"
            color={signIn ? "blue" : "green"}
            text={signIn ? "Log in" : "Register"}
            withLoading
          />
        </form>
        <span className="text-center w-full inline-block my-2">or</span>
        <Button
          text={signIn ? "Register" : "Log in"}
          color={signIn ? "green" : "blue"}
          type="button"
          toggleModalTypeHandler={toggleModalTypeHandler}
        />
      </>
    );
  };

  const congratContent = () => {
    return (
      <div className="text-center">
        <p>You successfully registered!</p>
        <p>Go to the dashboard, to create you first tasks!</p>
        <Link href="/">
          <span className="my-2 inline-block text-blue-500">My Dashboard</span>
        </Link>
      </div>
    );
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
            {congrats ? "Congratulations" : modalType}
          </Dialog.Title>
          {congrats ? congratContent() : AuthForm()}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
