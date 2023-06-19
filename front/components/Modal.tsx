"use client";

import { AppContext } from "@/context/app-context";
import { Dialog } from "@headlessui/react";
import React, { useContext, useState } from "react";
import { Button } from "./Button";
import { REQUEST_LOGIN, REQUEST_REGISTER } from "@/requests";
import { AuthRequest, setAccessTokenToLS } from "@/utils";
import { Input } from "./Input";
import { ErrorMessage } from "./Error";
import { Congrats } from "./Congrats";
import { AuthResponse, UserCreads } from "@/types";

export const Modal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    setIsLoged,
    setIsLoading,
    setError,
    error,
    modalType,
    setModalType,
  } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [congrats, setCongrat] = useState(false);

  const signIn = modalType === "Sign in";

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const creads: UserCreads = { login: email, password };
    setIsLoading(true);
    return signIn ? login(creads) : register(creads);
  };

  const toggleModalTypeHandler = () => {
    setError("");
    clearForm();
    signIn ? setModalType("Sign up") : setModalType("Sign in");
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  const afterLogin = () => {
    setIsModalOpen(false);
    setIsLoged(true);
    setIsLoading(false);
    clearForm();
  };

  const afterRegister = () => {
    setIsLoged(true);
    setIsLoading(false);
    setCongrat(true);
  };

  const setErrors = (response: AuthResponse) => {
    setIsLoading(false);
    setError(response.message);
  };

  const login = async (creads: UserCreads) => {
    try {
      const response = await AuthRequest(REQUEST_LOGIN, creads);

      if (!response.error && !localStorage.getItem("access_token")) {
        setAccessTokenToLS(response?.access_token);
        afterLogin();
      }

      response?.error && setErrors(response);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const register = async (creads: UserCreads) => {
    try {
      const response = await AuthRequest(REQUEST_REGISTER, creads);

      if (!response.error && !localStorage.getItem("access_token")) {
        setAccessTokenToLS(response?.access_token);
        afterRegister();
      }

      response?.error && setErrors(response);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;
    switch (type) {
      case "email":
        return setEmail(value);
      case "password":
        return setPassword(value);
    }
  };

  const AuthForm = () => {
    return (
      <>
        <form onSubmit={onSubmitHandler} className=" w-300">
          <div className="mb-5">
            <Input type="email" onChangeHandler={handleChange} value={email} />
          </div>
          <div className="mb-5">
            <Input
              type="password"
              onChangeHandler={handleChange}
              value={password}
            />
          </div>
          {error && <ErrorMessage error={error} />}
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

  const onModalClosehandler = () => {
    setIsModalOpen(false);
    setCongrat(false);
    setEmail("");
    setPassword("");
    setModalType("Sign in");
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={onModalClosehandler}
      className="relative z-50 w-full max-w-md s"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left
            align-middle shadow-xl transition-all"
        >
          <Dialog.Title className="px-5 text-center font-bold mb-5">
            {congrats ? "Congratulations" : modalType}
          </Dialog.Title>
          {congrats ? (
            <Congrats onModalClosehandler={onModalClosehandler} />
          ) : (
            AuthForm()
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
