"use client";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogged, setIsLoged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [searchString, setSearchString] = useState("");

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
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
