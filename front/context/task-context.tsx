"use client";
import { CREATE_TASK, REQUEST_TASK } from "@/requests";
import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./app-context";

export const TaskContext = createContext({});

type Props = {
  children: React.ReactNode;
};

export const TaskContextProvider = ({ children }: Props) => {
  const {board, setBoard, setIsModalOpen} = useContext(AppContext)
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newTaskType, setNewTaskType] = useState("todo");
  const [image, setImage] = useState(null);
  const userId = JSON.parse(localStorage.getItem('userId'));

  const addTask = async (newTaskInput, newTaskType, image) => {
    const task = {
      title:newTaskInput,
      status: newTaskType,
      userId,
      image
    }

    const request = await fetch(CREATE_TASK,{
      method:'POST',
      body:JSON.stringify(task),
      mode:'cors',
      headers: {
        "Content-Type": "application/json",
      }
    })

    const newTask = await request.json()

  
    const newColumns = new Map(board.columns);

    const column = newColumns.get(newTaskType);

    if (!column) {
      newColumns.set(newTaskType, {
        id: newTaskType,
        todos: [newTask],
      });
    } else {
      newColumns.get(newTaskType)?.todos.push(newTask);
    }
    const updatedBoard = {
        columns: newColumns,
      }

      return await setBoard(updatedBoard);
  };

  const deleteTask = async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);
    setBoard({columns:newColumns})

    // if (todo.image) {
    //   await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    // }

    await fetch(`${REQUEST_TASK}/${todo.id}`,{
    method:"DELETE",
    mode:'cors',
    headers: {
      "Content-Type": "application/json",
    }
    });
  
  }


  const value = {
    addTask,
    newTaskInput,
    setNewTaskInput,
    newTaskType,
    setNewTaskType,
    // setNewTaskTypehandler,
    deleteTask,
    image,
    setImage,
  };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
