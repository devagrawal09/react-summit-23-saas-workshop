"use client";

import clsx from "clsx";

export type Todo = {
  completed: boolean;
  title: string;
  id: number;
};

export function AddTodoComponent({
  addTodo,
}: {
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
          await addTodo(title);
          form.reset();
        }}
        className="todo flex items-center border border-b border-solid px-2 py-1"
      >
        <input
          name="title"
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

export function TodoComponent({
  onDelete,
  onToggle,
  todo,
}: {
  onDelete: () => Promise<void>;
  onToggle: () => Promise<void>;
  todo: Todo;
}) {
  return (
    <div className="todo flex items-center gap-4 border-b px-2 py-1">
      <input
        type="checkbox"
        defaultChecked={todo.completed}
        onChange={() => onToggle()}
        className="h-5 w-5"
      />
      <span className={clsx("grow p-1", todo.completed && "line-through")}>
        {todo.title}
      </span>
      <button
        onClick={() => onDelete()}
        className="text-md rounded-full border border-none bg-white px-4 py-2 font-sans font-medium text-white hover:bg-gray-200 hover:text-inherit"
      >
        x
      </button>
    </div>
  );
}
