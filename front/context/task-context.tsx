"use client";
import { CREATE_TASK, REQUEST_TASK } from "@/requests";
import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./app-context";
import { uploadImage } from "@/lib/uploadImage";
import { storage } from "@/appwrite";
import { Image, Todo, TypedColumn } from "@/types";
import {
  createAppwriteSession,
  getCurrentAppwriteUser,
  clearUserCache,
} from "@/lib/appwriteAuth";

type TaskContextType = {
  newTaskInput: string;
  setNewTaskInput: (v: string) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (v: TypedColumn) => void;
  image: File | null;
  setImage: (f: File | null) => void;
  addTask: (title: string, status: TypedColumn, image: File | null) => Todo;
  deleteTask: (index: number, todo: Todo, id: TypedColumn) => void;
  updateTodoInDB: (id: string, status: TypedColumn) => void;
};

export const TaskContext = createContext({} as unknown as TaskContextType);

type Props = {
  children: React.ReactNode;
};

export const TaskContextProvider = ({ children }: Props) => {
  const { board, setBoard } = useContext(AppContext);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newTaskType, setNewTaskType] = useState("todo");
  const [image, setImage] = useState(null);
  const [appwriteAuthChecked, setAppwriteAuthChecked] = useState(false);

  let userId = null;

  if (localStorage.getItem("userId")) {
    userId = JSON.parse(localStorage.getItem("userId")!);
  } else {
    userId = null;
  }

  // Функция для синхронизации авторизации с Appwrite (вызывается только один раз)
  const ensureAppwriteAuth = async () => {
    if (appwriteAuthChecked) {
      return; // Уже проверили авторизацию
    }

    try {
      // Проверяем, есть ли активная сессия
      const currentUser = await getCurrentAppwriteUser();
      if (!currentUser) {
        // Если нет активной сессии, создаем её
        const email = localStorage.getItem("userEmail");
        const password = localStorage.getItem("userPassword");

        if (email && password) {
          console.log("Creating Appwrite session...");
          await createAppwriteSession(email, password);
          console.log("Appwrite session created successfully");
        } else {
          console.log("No Appwrite credentials found in localStorage");
          throw new Error("No Appwrite credentials found");
        }
      } else {
        console.log("Appwrite session already active");
      }
      setAppwriteAuthChecked(true);
    } catch (error) {
      console.error("Appwrite auth sync error:", error);
      // Очищаем кэш при ошибке авторизации
      clearUserCache();
      throw error;
    }
  };

  const addTask = async (
    title: string,
    status: string,
    image?: File | null
  ) => {
    let file = null;

    //create task object
    const task = {
      title,
      status,
      userId,
      image,
    } as unknown as Todo;

    //Upload image to appwrite
    if (image) {
      try {
        const fileUploaded = await uploadImage(image);
        if (fileUploaded) {
          file = {
            bucketId: fileUploaded.bucketId,
            fileId: fileUploaded.$id,
          } as unknown as Image;
          task.image = file;
        }
      } catch (e) {
        console.log("Upload image error: ", e);
        task.image = null;
      }
    }

    const token = JSON.parse(localStorage.getItem("access_token")!);

    // Add task request
    let newTask = {} as Todo;
    try {
      const request = await fetch(CREATE_TASK, {
        method: "POST",
        body: JSON.stringify(task),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
      }

      //Recive new task
      newTask = await request.json();
      return newTask;
    } catch (e) {
      console.log("Error adding new task", e);
    }
  };

  const deleteTask = async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);
    setBoard({ columns: newColumns });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    if (!todo.id) return;

    const token = JSON.parse(localStorage.getItem("access_token")!);

    try {
      await fetch(`${REQUEST_TASK}/${todo.id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting task from database:", error);
    }
  };

  const updateTodoInDB = async (id, status) => {
    if (!id) return;

    const token = JSON.parse(localStorage.getItem("access_token")!);

    try {
      const request = await fetch(`${REQUEST_TASK}/${id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await request.json();
      console.log("res", res);
    } catch (error) {
      console.error("Error updating task in database:", error);
    }
  };

  const value = {
    addTask,
    newTaskInput,
    setNewTaskInput,
    newTaskType,
    setNewTaskType,
    deleteTask,
    image,
    setImage,
    updateTodoInDB,
  } as unknown as TaskContextType;

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
