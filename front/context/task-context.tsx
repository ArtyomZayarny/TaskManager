"use client";
import { CREATE_TASK, REQUEST_TASK } from "@/requests";
import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./app-context";
import { uploadImage } from "@/lib/uploadImage";
import { storage, client } from "@/appwrite";
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

  let userId: string | null = null;

  if (typeof window !== "undefined" && localStorage.getItem("userId")) {
    userId = JSON.parse(localStorage.getItem("userId")!);
  }

  const ensureAppwriteAuth = async () => {
    if (appwriteAuthChecked) {
      return;
    }

    try {
      const currentUser = await getCurrentAppwriteUser();
      if (!currentUser) {
        const email =
          typeof window !== "undefined"
            ? localStorage.getItem("userEmail")
            : null;
        const password =
          typeof window !== "undefined"
            ? localStorage.getItem("userPassword")
            : null;

        if (email && password) {
          await createAppwriteSession(email, password);
        } else {
          throw new Error("No Appwrite credentials found");
        }
      }
      setAppwriteAuthChecked(true);
    } catch (error) {
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

    const task = {
      title,
      status,
      userId,
      image,
    } as unknown as Todo;

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
        task.image = undefined;
      }
    }

    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("access_token") || "null")
        : null;

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

      newTask = await request.json();
      return newTask;
    } catch (e) {}
  };

  const deleteTask = async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);
    setBoard({ columns: newColumns });

    if (todo.image) {
      try {
        // Используем Appwrite сессию для авторизации
        await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
      } catch (error) {
        console.error("Error deleting file from Appwrite:", error);
        // Если не удалось удалить файл, продолжаем без ошибки
      }
    }

    if (!todo.id) return;

    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("access_token") || "null")
        : null;

    try {
      await fetch(`${REQUEST_TASK}/${todo.id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {}
  };

  const updateTodoInDB = async (id: string, status: string) => {
    if (!id) return;

    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("access_token") || "null")
        : null;

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
    } catch (error) {}
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
