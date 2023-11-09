import { AddTodoComponent, Todo, TodoComponent } from "../todos";

export default function HomePage() {
  const todos: Todo[] = [
    {
      id: 1,
      title: "Initialize Project",
      completed: true,
    },
    {
      id: 2,
      title: "Create Todo App",
      completed: false,
    },
  ];

  return (
    <main>
      <h1 className="todos-title">todos</h1>
      <div className="todos-card">
        <AddTodoComponent />

        {todos?.length ? (
          todos.map((todo) => <TodoComponent todo={todo} key={todo.id} />)
        ) : (
          <div className="flex">
            <div className="todos-text">No todos found</div>
          </div>
        )}
      </div>
    </main>
  );
}
