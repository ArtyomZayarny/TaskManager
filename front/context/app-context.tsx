"use client";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { Board, Column, TypedColumn } from "@/types";
import React, { createContext, useEffect, useState } from "react";

type AppContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  isLogged: boolean;
  setIsLoged: (v: boolean) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  error: string;
  setError: (v: string) => void;
  searchString: string;
  setSearchString: (v: string) => void;
  modalType: string;
  setModalType: (v: string) => void;
  getBoard: (board: Board) => Board;
};

export const AppContext = createContext({} as AppContextType);

type Props = {
  children: React.ReactNode;
};

const initialBoard = {
  columns: new Map<TypedColumn, Column>(),
};

export const AppContextProvider = ({ children }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogged, setIsLoged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchString, setSearchString] = useState("");
  const [modalType, setModalType] = useState("Sign in");
  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    //check if storarage have token
    if (localStorage.getItem("access_token")) {
      setIsLoged(true);
    }
  }, []);

  const logOut = async () => {
    await localStorage.removeItem("access_token");
    await setIsLoged(false);
  };

  const getBoard = async () => {
    const GroupedBoard = await getTodosGroupedByColumn();
    setBoard(GroupedBoard);
  };

  const value = {
    setIsModalOpen,
    isModalOpen,
    isLogged,
    logOut,
    setIsLoged,
    isLoading,
    setIsLoading,
    error,
    setError,
    searchString,
    setSearchString,
    modalType,
    setModalType,
    getBoard,
    board,
  } as unknown as AppContextType;
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};