import { REQUEST_TASK } from "@/requests";
import { Board, Column, TypedColumn } from "@/types";

export const getTodosGroupedByColumn = async () => {
  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userId") || "null")
      : null;
  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("access_token") || "null")
      : null;

  let todos = [];

  if (userId) {
    const requestTasks = await fetch(`${REQUEST_TASK}/${userId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    todos = await requestTasks.json();
  }

  const columns = todos.reduce((acc: Map<TypedColumn, Column>, todo: any) => {
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
      ...(todo.image && { image: todo.image }),
    });
    return acc;
  }, new Map<TypedColumn, Column>());

  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  const sortedEntries = (
    Array.from(columns.entries()) as [TypedColumn, Column][]
  ).sort((a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]));
  const sortedColumns = new Map<TypedColumn, Column>(sortedEntries);
  const board: Board = {
    columns: sortedColumns,
  };
  return board;
};
