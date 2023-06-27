"use client";
import { CREATE_TASK, REQUEST_TASK } from "@/requests";
import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./app-context";
import { uploadImage } from "@/lib/uploadImage";
import { storage } from "@/appwrite";
import { Image, Todo, TypedColumn } from "@/types";

type TaskContextType = {
  newTaskInput:string;
   setNewTaskInput:(v:string) =>void;
  newTaskType:TypedColumn;
   setNewTaskType:(v:TypedColumn)=>void;
  image:File | null;
  setImage: (f:File | null) =>void;
  addTask: (title:string, status:TypedColumn, image:File | null) => Todo
  deleteTask:(index:number,todo:Todo,id:TypedColumn) =>void
  updateTodoInDB: (id:string, status:TypedColumn)=>void
}



export const TaskContext = createContext({}as unknown as TaskContextType);

type Props = {
  children: React.ReactNode;
};

export const TaskContextProvider = ({ children }: Props) => {
  const { board, setBoard } = useContext(AppContext);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [newTaskType, setNewTaskType] = useState("todo");
  const [image, setImage] = useState(null);
  const userId = JSON.parse(localStorage.getItem("userId")!);

  const addTask = async (title:string, status:string, image?:File | null) => {
    let file = null;

    //create task object
    const task = {
      title,
      status,
      userId,
      image,
    } as unknown as Todo;

    //Upload image to appwrite
    if(image) {
      try {
        const fileUploaded = await uploadImage(image);
        if (fileUploaded) {
          file = {
            bucketId: fileUploaded.bucketId,
            fileId: fileUploaded.$id,
          } as unknown as Image ;
          task.image = file;
        }
      } catch (e) {
        console.log("Upload image error: ", e);
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

      //Recive new task
      return (newTask = await request.json());
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

    const token = JSON.parse(localStorage.getItem("access_token")!);

    await fetch(`${REQUEST_TASK}/${todo.id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const updateTodoInDB = async (id, status) => {


    const token = JSON.parse(localStorage.getItem("access_token")!);


    const request = await fetch(`${REQUEST_TASK}/${id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({status}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await request.json();
    console.log('res', res)
  }

  const value = {
    addTask,
    newTaskInput,
    setNewTaskInput,
    newTaskType,
    setNewTaskType,
    deleteTask,
    image,
    setImage,
    updateTodoInDB
  } as unknown as TaskContextType;

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
