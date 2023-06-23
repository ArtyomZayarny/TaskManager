//import { databases } from "@/appwrite";

import { REQUEST_TASK } from "@/requests";
import { Board, Column, TypedColumn } from "@/types";

export const getTodosGroupedByColumn = async () => {
 const userId = JSON.parse(localStorage.getItem('userId'));

 let todos = [];
 if(userId) {
  const requestTasks = await fetch(`${REQUEST_TASK}/${userId}`,{
    method:'GET',
    mode:'cors',
    headers: {
      "Content-Type": "application/json",
    }
  });
  todos = await requestTasks.json();
 }


  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      id: todo._id,
      createdAt: todo.createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });
    return acc;
  }, new Map<TypedColumn, Column>());

  //Add empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  //Sort column
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );
  const board: Board = {
    columns: sortedColumns,
  };
  return board;
};
