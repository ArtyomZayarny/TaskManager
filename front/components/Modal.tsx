"use client";

import { AppContext } from "@/context/app-context";
import { Dialog } from "@headlessui/react";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { Button } from "./Button";
import { REQUEST_LOGIN, REQUEST_REGISTER } from "@/requests";
import { AuthRequest, setAccessTokenToLS, storeToLS } from "@/utils";
import { Input } from "./Input";
import { ErrorMessage } from "./Error";
import { Congrats } from "./Congrats";
import { AuthResponse, UserCreads } from "@/types";
import { TaskContext } from "@/context/task-context";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import {
  createAppwriteSession,
  createAppwriteAccount,
} from "@/lib/appwriteAuth";

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
    getBoard,
  } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [congrats, setCongrat] = useState(false);

  const signIn = modalType === "Sign in";

  useEffect(() => {
    if (isModalOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setCongrat(false);
    }
  }, [isModalOpen, setError]);

  const clearForm = useCallback(() => {
    setEmail("");
    setPassword("");
  }, []);

  const afterLogin = useCallback(async () => {
    setIsModalOpen(false);
    setIsLoged(true);
    setIsLoading(false);
    clearForm();
    await getBoard();
  }, [clearForm, getBoard, setIsModalOpen, setIsLoged, setIsLoading]);

  const afterRegister = useCallback(() => {
    setIsLoged(true);
    setIsLoading(false);
    setCongrat(true);
  }, [setIsLoged, setIsLoading]);

  const setErrors = useCallback((response: AuthResponse) => {
    setIsLoading(false);
    setError(response.message);
  }, [setIsLoading, setError]);

  const login = useCallback(async (creads: UserCreads) => {
    try {
      const response = await AuthRequest(REQUEST_LOGIN, creads);
      const { access_token, userId } = response;
      if (!response.error && !localStorage.getItem("access_token")) {
        storeToLS("access_token", access_token);
        userId !== undefined && storeToLS("userId", userId);

        try {
          await createAppwriteSession(creads.login, creads.password);
          storeToLS("userEmail", creads.login);
          storeToLS("userPassword", creads.password);
        } catch (appwriteError) {}

        afterLogin();
      }

      response?.error && setErrors(response);
    } catch (e) {
      setIsLoading(false);
    }
  }, [afterLogin, setErrors, setIsLoading]);

  const register = useCallback(async (creads: UserCreads) => {
    try {
      const response = await AuthRequest(REQUEST_REGISTER, creads);
      const { access_token, userId } = response;
      if (!response.error && !localStorage.getItem("access_token")) {
        storeToLS("access_token", access_token);
        userId !== undefined && storeToLS("userId", userId);

        try {
          await createAppwriteAccount(creads.login, creads.password);
          storeToLS("userEmail", creads.login);
          storeToLS("userPassword", creads.password);
        } catch (appwriteError) {}

        afterRegister();
      }

      response?.error && setErrors(response);
    } catch (e) {
      setIsLoading(false);
    }
  }, [afterRegister, setErrors, setIsLoading]);

  const onSubmitHandler = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const creads: UserCreads = { login: email, password };
    setIsLoading(true);
    return signIn ? login(creads) : register(creads);
  }, [email, password, signIn, login, register, setIsLoading]);

  const toggleModalTypeHandler = useCallback(() => {
    setError("");
    clearForm();
    signIn ? setModalType("Sign up") : setModalType("Sign in");
  }, [signIn, clearForm, setError, setModalType]);



  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const onModalClosehandler = () => {
    setIsModalOpen(false);
    setCongrat(false);
    setEmail("");
    setPassword("");
    setError("");
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
            <>
              <form onSubmit={onSubmitHandler} className=" w-300">
                <div className="mb-5">
                  <Input type="email" onChangeHandler={handleEmailChange} value={email} />
                </div>
                <div className="mb-5">
                  <Input
                    type="password"
                    onChangeHandler={handlePasswordChange}
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
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
