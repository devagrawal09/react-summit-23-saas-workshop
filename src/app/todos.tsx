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
        className="todo flex items-center border border-b border-solid px-2 py-1"
      >
        <input
          placeholder="What needs to be done?"
          className="w-full p-1 outline-none placeholder:italic"
        />
        <button className="text-md rounded-full border border-none bg-white px-4 py-2 font-sans font-medium text-white hover:bg-gray-200 hover:text-inherit">
          Add
        </button>
      </form>
    </>
  );
}

export function TodoComponent({ todo }: { todo: Todo }) {
  async function toggleCompleted(todo: Todo) {}

  async function deleteTodo(todo: Todo) {}

  return (
    <div className="todo flex items-center gap-4 border-b px-2 py-1">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo)}
        className="h-5 w-5"
      />
      <span className={clsx("grow p-1", todo.completed && "line-through")}>
        {todo.title}
      </span>
      <button
        onClick={() => deleteTodo(todo)}
        className="text-md rounded-full border border-none bg-white px-4 py-2 font-sans font-medium text-white hover:bg-gray-200 hover:text-inherit"
      >
        x
      </button>
    </div>
  );
}
