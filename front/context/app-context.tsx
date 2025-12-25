"use client";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { Board, Column, TypedColumn } from "@/types";
import React, { createContext, useEffect, useState, useMemo, useCallback } from "react";

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
  getBoard: () => Promise<void>;
  board: Board;
  setBoard: (v: Board) => void;
  showAddTaskModal: boolean;
  setShowAddTaskModal: (v: boolean) => void;
  logOut: () => void;
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
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsLoged(true);
      const email = localStorage.getItem("userEmail");
      const password = localStorage.getItem("userPassword");
    }
  }, []);

  const getBoard = useCallback(async () => {
    const GroupedBoard = await getTodosGroupedByColumn();
    await setBoard(GroupedBoard);
  }, []);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const logOut = useCallback(async () => {
    await localStorage.clear();
    await setIsLoged(false);
    getBoard();
  }, [getBoard]);

  const value = useMemo(() => ({
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
    setBoard,
    showAddTaskModal,
    setShowAddTaskModal,
  } as AppContextType), [
    isModalOpen,
    isLogged,
    isLoading,
    error,
    searchString,
    modalType,
    board,
    showAddTaskModal,
    logOut,
    getBoard,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
