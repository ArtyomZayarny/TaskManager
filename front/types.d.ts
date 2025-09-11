export type AuthResponse = {
  code: string;
  message: string;
};

export type UserCreads = {
  login: string;
  password: string;
};

interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Image {
  bucketId: string;
  fileId: string;
}

interface Todo {
  id: string;
  createdAt: string;
  title: string;
  status: string;
  image?: Image;
}
