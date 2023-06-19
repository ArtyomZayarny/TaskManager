"use client";
import React, { createContext, useState } from "react";

export const TaskContext = createContext({});

type Props = {
  children: React.ReactNode;
};

export const TaskContextProvider = ({ children }: Props) => {
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newTaskType, setNewTaskType] = useState("todo");
  const [image, setImage] = useState(null);

  const addTask = (newTaskInput, newTaskType, image) => {
    console.log(
      "newTaskInput, newTaskType, image",
      newTaskInput,
      newTaskType,
      image
    );
  };

  //   const setNewTaskTypehandler = (status) => {
  //     console.log("status", status);
  //   };

  const value = {
    addTask,
    newTaskInput,
    setNewTaskInput,
    newTaskType,
    setNewTaskType,
    // setNewTaskTypehandler,
    image,
    setImage,
  };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
