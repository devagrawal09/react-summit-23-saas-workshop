"use client";

import clsx from "clsx";

export type Todo = {
  completed: boolean;
  title: string;
  id: number;
};

export function AddTodoComponent() {
  async function addTodo(title: string) {
    console.log(`Adding todo: ${title}`);
  }

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const title = formData.get("title") as string;

          await addTodo(title);

          form.reset();
        }}
        className="todos-form"
      >
        <input placeholder="What needs to be done?" className="todos-input" />
        <button className="todos-add">Add</button>
      </form>
    </>
  );
}

export function TodoComponent({ todo }: { todo: Todo }) {
  async function toggleCompleted(todo: Todo) {}

  async function deleteTodo(todo: Todo) {}

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
