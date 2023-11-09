"use client";

import clsx from "clsx";

export type Todo = {
  completed: boolean;
  title: string;
  id: number;
};

export function AddTodoComponent(props: {
  addTodo: (title: string) => Promise<void>;
}) {
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const title = formData.get("title") as string;

          await props.addTodo(title);

          form.reset();
        }}
        className="todos-form"
      >
        <input
          name="title"
          placeholder="What needs to be done?"
          className="todos-input"
        />
        <button className="todos-add">Add</button>
      </form>
    </>
  );
}

export function TodoComponent({
  todo,
  toggleCompleted,
  deleteTodo,
}: {
  todo: Todo;
  toggleCompleted: (todo: Todo) => Promise<void>;
  deleteTodo: (todo: Todo) => Promise<void>;
}) {
  return (
    <div className="todos-todo">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo)}
        className="h-5 w-5"
      />
      <span className={clsx("grow p-1", todo.completed && "line-through")}>
        {todo.title}
      </span>
      <button onClick={() => deleteTodo(todo)} className="todo-delete">
        x
      </button>
    </div>
  );
}
